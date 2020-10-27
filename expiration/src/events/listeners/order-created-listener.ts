import { Listener, OrderCreatedEvent, Subjects } from '@oryahtickets/common'
import { Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name'
import { epirationQueue } from '../../queues/expriration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiredAt).getTime() - new Date().getTime()
    console.log('Waiting this many millesecods to process the job', delay)

    await epirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    )

    msg.ack()
  }
}
