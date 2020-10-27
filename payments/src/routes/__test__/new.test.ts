import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { OrderStatus } from '@oryahtickets/common'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

function generateId() {
  return mongoose.Types.ObjectId().toHexString()
}

it('return a 404 when purshing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asdlkfj',
      orderId: generateId(),
    })
    .expect(404)
})

it('returns a 401 then purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: generateId(),
    userId: generateId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'lsakdfj',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 then purching a cancelled order', async () => {
  const userId = generateId()
  const order = Order.build({
    id: generateId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'sadlkfj',
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = generateId()
  const price = Math.floor(Math.random() * 10000)
  const order = Order.build({
    id: generateId(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })
  await order.save();

  (stripe.charges.create as jest.Mock).mockResolvedValue({ id: generateId() })

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(price)
  expect(chargeOptions.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
  })

  expect(payment).not.toBeNull()
})
