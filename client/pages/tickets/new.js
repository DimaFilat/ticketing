import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

export default function NewTicket() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () =>  Router.push('/')
  })

  function onBlur() {
    const value = parseFloat(price)

    if (isNaN(value)) return

    setPrice(value.toFixed(2))
  }

  function onSubmit(e) {
    e.preventDefault()
    doRequest()
  }

  return (
    <div className='container'>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          <input
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type='text'
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>Price</label>
          <input
            className='form-control'
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            type='text'
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}
