import Link from 'next/link'

export default function LandingPage({ currentUser, tickets }) {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id} className='container'>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })
  return (
    <div>
      <h1>
        Tickets
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </h1>
    </div>
  )
}

LandingPage.getInitialProps = async function (ctx, client, currentUser) {
  const { data } = await client.get('/api/tickets')
  return { currentUser, tickets: data }
}

// LandingPage.getInitialProps = async function ({ req }) {
//   if (typeof window === 'undefined') {
//     // We are on the server!
//     // Request shoul be made to http://ingress-nginx.ingres-inginx...
//     try {
//       const { data } = await axios.get(
//         // 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
//         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
//         {
//           headers: req.headers,
//         }
//       )
//       console.log(data)
//     } catch (error) {
//       console.log(error)
//     }
//     return {}
//   } else {
//     // We are on the client
//     // Requst can be made with base url of ''
//     const { data } = await axios.get('/api/users/currentuser')
//     return data
//   }

// }

// export async function getStaticProps() {
//   console.log('I was EXECUTED !!!!!')

//   return { props: {} }
// const response = await axios.get('/api/users/currentuser')

// return {
//   props: {
//     ...response.data
//   },
// }

// }
