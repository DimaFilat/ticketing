import axios from 'axios'
import { useState } from 'react'

export default function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  async function doRequest(props = {}) {
    try {
      setErrors(null)
      const response = await axios[method](url, { ...body, ...props })
      console.log(response)

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      console.error(err)
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err &&
              err.response &&
              err.response.data &&
              err.response.data.errors.map(({ message }) => (
                <li key={message}>{message}</li>
              ))}
          </ul>
        </div>
      )
    }
  }
  return { doRequest, errors }
}
