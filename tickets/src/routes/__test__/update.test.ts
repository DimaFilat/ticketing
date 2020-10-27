import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'asdflkajsldk',
      price: 30,
    })
    .expect(404)
})

it('returns a 401 if the user not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdflkajsldk',
      price: 30,
    })
    .expect(401)
})

it('returns a 401 if the user does not own a ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'asdlfkaslk',
      price: 30,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'asdsadflfkaslk',
      price: 15,
    })
    .expect(401)
})

it('returns a 400 if the user provides an invalid tilte or price', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdlfkaslk',
      price: 30,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'lsdfajlka',
      price: -20,
    })
    .expect(400)
})

it('update the ticket provided valid inputs', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdlfkaslk',
      price: 30,
    })
    .expect(201)

  const newTitle = 'lssdafdfajlka'
  const newPrice = 200

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(newTitle)
  expect(ticketResponse.body.price).toEqual(newPrice)
})

it('publish an event', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdlfkaslk',
      price: 30,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'lsdfajlka',
      price: 20,
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects update ticket if the ticket been reserved', async () => {
  const cookie = global.signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdlfkaslk',
      price: 30,
    })
    .expect(201)

  const ticket = await Ticket.findById(response.body.id)
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdlfkaslk',
      price: 50,
    })
    .expect(400)
})
