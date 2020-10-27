import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderStatus } from '@oryahtickets/common'
import { Message } from 'node-nats-streaming'

import { OrderCancelListener } from '../order-cancel-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'

async function setup() {
  const listener = new OrderCancelListener(natsWrapper.client)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'slkfjasl;dkf',
    version: 0,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'lkasdfls',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, order, data, msg }
}

it('updates the status of the order', async () => {
  const { listener, data, order, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
