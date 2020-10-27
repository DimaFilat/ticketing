import { Publisher, OrderCreatedEvent, Subjects } from '@oryahtickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
