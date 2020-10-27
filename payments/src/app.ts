import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { errorHandler, NotFoundError, currentUser } from '@oryahtickets/common'

import { createChargeRouter } from './routes/new'

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
app.use(createChargeRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
