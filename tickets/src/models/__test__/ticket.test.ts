import { Ticket } from '../ticket'

it('implements optimistic concurency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  // Save the ticket ro the database
  await ticket.save()

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  // save the first fetched ticket
  await firstInstance!.save()

  // save the second fetched ticket and expect an 
  // better testing to expect throw becouse we expect throw Error on router
  // for nats resent this event in this case mongo can shutdown and all test
  // will be passed
  try {
    await secondInstance!.save()
  } catch (err) {
    return done()
  }

  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
