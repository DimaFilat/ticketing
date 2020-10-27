import express, { Request, Response } from 'express'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@oryahtickets/common'

import { Order, OrderStatus } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')
    console.log('version 0', order)

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    // publishing an event saiyng the thing is cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(200).send(order)
  }
)

export { router as cancelOrderRouter }
