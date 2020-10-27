  import axios from 'axios'

export default function buildClient({ req }) {
  if (typeof window === 'undefined') {
    // We are on the server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    })
  }
  // We are on the client
  return axios.create({ baseURL: '/' })
}
