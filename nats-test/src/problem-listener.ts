import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@oryahtickets/common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'order-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Problem listener', data)
    // const { title, price, id } = datad

    // const ticket = Ticket.build({
    //   title,
    //   price,
    //   id,
    // })
    // await ticket.save()

    msg.ack()
  }
}
