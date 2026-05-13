import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function Profile() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {

    try {

      const response = await API.get('/users/current-user')

      console.log(response.data)

      setUser(response.data.data)

    } catch (err) {

      console.log(err.response?.data || err.message)
    }
  }

  if (!user) {
    return (
      <div className='text-white ml-[240px] p-10'>
        Loading profile...
      </div>
    )
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white'>

      <div className='relative'>

        <img
          src={user.coverImage}
          alt='cover'
          className='w-full h-[320px] object-cover'
        />

        <div className='absolute -bottom-16 left-10'>

          <img
            src={user.avatar}
            alt='avatar'
            className='w-36 h-36 rounded-full border-4 border-black object-cover'
          />

        </div>

      </div>

      <div className='pt-24 px-10'>

        <h1 className='text-4xl font-black'>
          {user.fullName}
        </h1>

        <p className='text-zinc-400 text-lg mt-2'>
          @{user.userName}
        </p>

        <p className='text-zinc-500 mt-4'>
          {user.email}
        </p>

      </div>

    </div>
  )
}