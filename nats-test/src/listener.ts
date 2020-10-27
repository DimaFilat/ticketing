import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'

import { TicketCreatedListener } from './problem-listener'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

;(async function () {
  function connect() {
    return new Promise((resolve, reject) => {
      stan.on('connect', () => {
        console.log('Listener connected to NATS')
        resolve()
      })
    })
  }
  await connect()
  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })
  process.on('SIGINT', () => stan.close())
  process.on('SIGTERM', () => stan.close())
  new TicketCreatedListener(stan).listen()
})()
