import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { errorHandler, NotFoundError, currentUser } from '@oryahtickets/common'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

const { urlencoded, json } = express
const app = express()
app.set('trust proxy', true)

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cors())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
