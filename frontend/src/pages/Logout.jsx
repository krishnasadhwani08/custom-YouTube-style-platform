import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import API from '../api/axios'

export default function Logout() {

  const navigate = useNavigate()

  useEffect(() => {

    logoutUser()

  }, [])

  const logoutUser = async () => {

    try {

      await API.post('/users/logout')

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )

    } finally {

      localStorage.removeItem('user')

      localStorage.removeItem(
        'accessToken'
      )

      navigate('/login')
    }
  }

  return (

    <div className='loading'>

      <div className='flex flex-col items-center gap-5'>

        <div className='spinner' />

        <h2 className='text-2xl font-bold'>

          Logging you out...

        </h2>

        <p className='text-zinc-500'>

          destroying authentication rituals

        </p>

      </div>

    </div>
  )
}