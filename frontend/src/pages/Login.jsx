import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate()

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const loginHandler = async (e) => {

    e.preventDefault()

    try {

      const response = await API.post('/users/login', {
        email: data.email,
        password: data.password
      })

      console.log(response.data)

      alert('Login successful')

      navigate('/')

    } catch (err) {

      console.log(err.response?.data || err.message)

      alert('Login failed')
    }
  }

  return (

    <div className='h-screen flex items-center justify-center bg-black'>

      <form
        onSubmit={loginHandler}
        className='bg-zinc-900 p-10 rounded-3xl w-[400px]'
      >

        <h1 className='text-3xl font-black text-neon mb-6'>
          Login
        </h1>

        <input
          type='email'
          placeholder='Email'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setData({
              ...data,
              email: e.target.value
            })
          }
        />

        <input
          type='password'
          placeholder='Password'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setData({
              ...data,
              password: e.target.value
            })
          }
        />

        <button
          className='w-full bg-neon py-3 rounded-xl font-bold'
        >
          Continue
        </button>

      </form>

    </div>
  )
}