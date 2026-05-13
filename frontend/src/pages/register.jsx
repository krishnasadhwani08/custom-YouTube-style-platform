import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  })

  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const registerHandler = async (e) => {

    e.preventDefault()

    try {

      const data = new FormData()

      data.append('fullName', formData.fullName)
      data.append('userName', formData.username)
      data.append('email', formData.email)
      data.append('password', formData.password)

      if (avatar) {
        data.append('avatar', avatar)
      }

      if (coverImage) {
        data.append('coverImage', coverImage)
      }

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1])
      }

      const response = await API.post('/users/register', data)

      console.log(response.data)

      alert('Registration successful')

      navigate('/login')

    } catch (err) {

      console.log(err.response?.data || err.message)

      alert('Registration failed')
    }
  }

  return (

    <div className='h-screen flex items-center justify-center bg-black'>

      <form
        onSubmit={registerHandler}
        className='bg-zinc-900 p-10 rounded-3xl w-[450px]'
      >

        <h1 className='text-3xl font-black text-neon mb-6'>
          Create Account
        </h1>

        <input
          type='text'
          placeholder='Full Name'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setFormData({
              ...formData,
              fullName: e.target.value
            })
          }
        />

        <input
          type='text'
          placeholder='Username'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value
            })
          }
        />

        <input
          type='email'
          placeholder='Email'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        <input
          type='password'
          placeholder='Password'
          className='w-full p-3 rounded-xl bg-zinc-800 mb-4'
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value
            })
          }
        />

        <label className='block mb-2 text-sm text-zinc-400'>
          Upload Avatar
        </label>

        <input
          type='file'
          className='mb-4'
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <label className='block mb-2 text-sm text-zinc-400'>
          Upload Cover Image
        </label>

        <input
          type='file'
          className='mb-6'
          onChange={(e) => setCoverImage(e.target.files[0])}
        />

        <button
          className='w-full bg-neon py-3 rounded-xl font-bold'
        >
          Register
        </button>

      </form>

    </div>
  )
}