import { useEffect, useState } from 'react'

import API from '../api/axios'

export default function Profile() {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchUser()

  }, [])

  const fetchUser = async () => {

    try {

      const res = await API.get(
        '/users/current-user'
      )

      setUser(res.data.data)

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )

    } finally {

      setLoading(false)
    }
  }

  if (loading) {

    return (

      <div className='page-wrapper'>

        <div className='loading'>

          <div className='spinner' />

        </div>

      </div>
    )
  }

  if (!user) {

    return (

      <div className='page-wrapper'>

        <div className='glass-card p-10 text-center'>

          <h2 className='text-3xl font-bold mb-4'>
            Profile not found
          </h2>

          <p className='muted'>
            user data failed to load
          </p>

        </div>

      </div>
    )
  }

  return (

    <div className='page-wrapper fade-up'>

      {/* Cover */}

      <div className='relative rounded-[32px] overflow-hidden border border-zinc-800 mb-10'>

        <img
          src={
            user.coverImage ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop'
          }
          alt='cover'
          className='w-full h-[260px] md:h-[340px] object-cover'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />

      </div>

      {/* Profile Section */}

      <div className='relative -mt-24 px-4 md:px-10'>

        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-8'>

          {/* Avatar + Info */}

          <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>

            <div className='relative'>

              <div className='w-[150px] h-[150px] rounded-full p-[4px] bg-gradient-to-br from-cyan-400 to-violet-500'>

                <img
                  src={
                    user.avatar ||
                    'https://via.placeholder.com/300'
                  }
                  alt='avatar'
                  className='w-full h-full rounded-full object-cover border-4 border-black'
                />

              </div>

            </div>

            <div className='text-center md:text-left'>

              <h1 className='text-4xl md:text-5xl font-black mb-2'>

                {user.fullName}

              </h1>

              <p className='text-zinc-400 text-lg mb-2'>

                @{user.userName}

              </p>

              <p className='text-zinc-500 text-sm'>

                {user.email}

              </p>

            </div>

          </div>

          {/* Action */}

          <div>

            <button className='btn-primary'>

              Edit Profile

            </button>

          </div>

        </div>

        {/* Stats */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>

          <div className='glass-card p-8 text-center'>

            <h2 className='text-4xl font-black mb-2'>

              {user.videosCount ?? 0}

            </h2>

            <p className='text-zinc-400'>

              Videos

            </p>

          </div>

          <div className='glass-card p-8 text-center'>

            <h2 className='text-4xl font-black mb-2'>

              {user.subscribersCount ?? 0}

            </h2>

            <p className='text-zinc-400'>

              Subscribers

            </p>

          </div>

          <div className='glass-card p-8 text-center'>

            <h2 className='text-4xl font-black mb-2'>

              {user.subscriptionsCount ?? 0}

            </h2>

            <p className='text-zinc-400'>

              Watching

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}
