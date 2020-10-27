import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@oryahtickets/common'

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
