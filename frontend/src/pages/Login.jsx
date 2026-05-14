import { useState } from 'react'

import { useNavigate, Link } from 'react-router-dom'

import API from '../api/axios'

export default function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    try {

      const response = await API.post(
        '/users/login',
        formData
      )

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.data.data.user
        )
      )

      alert('Login successful')

      navigate('/')

      window.location.reload()

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )

      alert(
        err.response?.data?.message ||
        'Login failed'
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className='min-h-screen bg-black flex items-center justify-center px-4'>

      <div className='w-full max-w-md bg-zinc-900 p-8 rounded-3xl shadow-2xl'>

        <h1 className='text-5xl font-black text-white mb-8 text-center'>
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >

          <input
            type='email'
            name='email'
            placeholder='Enter email'
            value={formData.email}
            onChange={handleChange}
            className='w-full bg-zinc-800 text-white p-4 rounded-2xl outline-none'
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Enter password'
            value={formData.password}
            onChange={handleChange}
            className='w-full bg-zinc-800 text-white p-4 rounded-2xl outline-none'
            required
          />

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-cyan-400 text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition duration-300'
          >

            {
              loading
                ? 'Logging in...'
                : 'Login'
            }

          </button>

        </form>

        <p className='text-zinc-400 text-center mt-6'>

          Don’t have an account?

          <Link
            to='/register'
            className='text-cyan-400 ml-2'
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}