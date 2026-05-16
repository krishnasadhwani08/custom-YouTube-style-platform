import {

  Eye,
  Heart,
  Users,
  Video

} from 'lucide-react'

import {

  useEffect,
  useState

} from 'react'

import API from '../api/axios'

export default function Dashboard() {

  const [stats, setStats] =
    useState(null)

  const [videos, setVideos] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const user =
    JSON.parse(
      localStorage.getItem('user')
    )

  useEffect(() => {

    if (user?._id) {

      fetchDashboard()
    }

  }, [])

  const fetchDashboard = async () => {

    try {

      /* Stats */

      const statsRes =
        await API.get(
          `/dashboard/stats/${user._id}`
        )

      setStats(
        statsRes.data.data
      )

      /* Videos */

      const videosRes =
        await API.get(
          `/dashboard/videos/${user._id}`
        )

      setVideos(
        videosRes.data.data || []
      )

    } catch (err) {

      console.log(
        err.response?.data ||
        err.message
      )

    } finally {

      setLoading(false)
    }
  }

  if (loading) {

    return (

      <div className='page-wrapper'>

        <h1 className='page-title'>
          Loading Dashboard...
        </h1>

      </div>
    )
  }

  const dashboardStats = [

    {
      title: 'Total Views',

      value:
        stats?.totalViews
          ?.toLocaleString(),

      icon:
        <Eye size={24} />,

      color:
        'from-cyan-500 to-blue-500'
    },

    {
      title: 'Subscribers',

      value:
        stats?.totalSubscribers
          ?.toLocaleString(),

      icon:
        <Users size={24} />,

      color:
        'from-pink-500 to-purple-500'
    },

    {
      title: 'Likes',

      value:
        stats?.totalLikes
          ?.toLocaleString(),

      icon:
        <Heart size={24} />,

      color:
        'from-red-500 to-orange-500'
    },

    {
      title: 'Videos',

      value:
        stats?.totalVideos
          ?.toLocaleString(),

      icon:
        <Video size={24} />,

      color:
        'from-emerald-500 to-teal-500'
    }
  ]

  return (

    <div className='page-wrapper fade-up'>

      {/* Header */}

      <div className='mb-10'>

        <h1 className='page-title'>

          Dashboard

        </h1>

        <p className='page-sub'>

          creator analytics and channel overview

        </p>

      </div>

      {/* Stats Grid */}

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>

        {dashboardStats.map((stat, i) => (

          <div
            key={stat.title}
            className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl'
            style={{
              animationDelay:
                `${i * 80}ms`
            }}
          >

            {/* Glow */}

            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.color}`} />

            {/* Content */}

            <div className='relative z-10'>

              {/* Icon */}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-5`}>

                {stat.icon}

              </div>

              {/* Label */}

              <p className='text-sm text-zinc-400 font-medium mb-2'>

                {stat.title}

              </p>

              {/* Value */}

              <h2 className='text-4xl font-black tracking-tight'>

                {stat.value || 0}

              </h2>

            </div>

          </div>

        ))}

      </div>

      {/* Recent Uploads */}

      <div className='mt-10'>

        <h2 className='text-3xl font-black mb-6'>

          Recent Uploads

        </h2>

        {videos.length === 0 ? (

          <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-zinc-400'>

            no uploads yet

          </div>

        ) : (

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>

            {videos.map((video) => (

              <div
                key={video._id}
                className='rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl'
              >

                {/* Thumbnail */}

                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className='w-full h-[180px] object-cover'
                />

                {/* Content */}

                <div className='p-5'>

                  <h3 className='font-black text-lg line-clamp-2 mb-2'>

                    {video.title}

                  </h3>

                  <p className='text-zinc-400 text-sm mb-4 line-clamp-2'>

                    {video.description}

                  </p>

                  <div className='flex items-center justify-between text-sm text-zinc-500'>

                    <span>

                      👁 {' '}

                      {video.views?.toLocaleString()} views

                    </span>

                    <span>

                      {
                        new Date(
                          video.createdAt
                        ).toLocaleDateString()
                      }

                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}