import 'bootstrap/dist/css/bootstrap.css'

import Header from '../components/header'
import buildClient from '../api/build-client'

export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  )
}

AppComponent.getInitialProps = async function ({ Component, ctx }) {
  const client = buildClient(ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client)
  }

  return {
    pageProps,
    ...data,
  }
}
