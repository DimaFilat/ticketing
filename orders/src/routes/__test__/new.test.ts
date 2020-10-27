import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

const ticketId = mongoose.Types.ObjectId().toHexString()

it('has a route handler listening to /api/orders for post request', async () => {
  const { status } = await request(app).post('/api/orders').send({})

  expect(status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401)
})

it('returns an error if the ticket does not exits', async () => {

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: ticketId
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'asdflaslkdfj',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a  ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 40,
    id: ticketId
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 40,
    id: ticketId
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
