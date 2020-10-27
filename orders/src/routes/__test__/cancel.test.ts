import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

const ticketId = mongoose.Types.ObjectId().toHexString()

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: ticketId,
  })
  await ticket.save()

  const user = global.signup()
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make a request to cancel an order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order created event', async () => {
  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: ticketId,
  })
  await ticket.save()

  const user = global.signup()
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make a request to cancel an order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
