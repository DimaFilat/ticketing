export default function OrderIndex({ orders }) {
  return (
    <ul>
      {orders.length > 0 ? (
        orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} &mdash; {order.status}
          </li>
        ))
      ) : (
        <div>Order history clear</div>
      )}
    </ul>
  )
}

OrderIndex.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/orders')

  return { orders: data }
}
