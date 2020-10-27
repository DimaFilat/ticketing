import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

export default function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeleft] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeleft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) return <div>Order expired</div>

  return (
    <div>
      <h1>Order show</h1>
      <h4>Time left to pay: {timeLeft}</h4>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51Hg4M3HkKdie7inEo4iqyyaWzlyzhsTcxYJEcbrEGOylKF5YxRGI2dAEm9wOfhBocXTw04eX5DdhcFpbOwwAdFxb00qmvCGPA2'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}
