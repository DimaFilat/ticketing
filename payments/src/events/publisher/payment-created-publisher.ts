import { Publisher, PaymentCreatedEvent, Subjects } from '@oryahtickets/common'

export class PaymentCreatePublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
