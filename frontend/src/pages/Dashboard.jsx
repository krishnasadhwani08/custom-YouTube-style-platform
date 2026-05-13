import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function Dashboard() {

  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {

    try {

      const currentUserRes =
        await API.get('/users/current-user')

      const currentUser =
        currentUserRes.data.data

      const channelId = currentUser._id

      const statsRes =
        await API.get(`/dashboard/stats/${channelId}`)

      const videosRes =
        await API.get(`/dashboard/videos/${channelId}`)

      setStats(statsRes.data.data)

      setVideos(videosRes.data.data)

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  if (!stats) {

    return (
      <div className='ml-[240px] text-white p-10'>
        Loading dashboard...
      </div>
    )
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-10'>

      <h1 className='text-5xl font-black mb-10'>
        Creator Dashboard
      </h1>

      <div className='grid grid-cols-4 gap-6 mb-12'>

        <div className='bg-zinc-900 rounded-3xl p-6'>
          <h2 className='text-zinc-400 text-lg mb-2'>
            Subscribers
          </h2>

          <p className='text-4xl font-black text-neon'>
            {stats.totalSubscribers}
          </p>
        </div>

        <div className='bg-zinc-900 rounded-3xl p-6'>
          <h2 className='text-zinc-400 text-lg mb-2'>
            Total Views
          </h2>

          <p className='text-4xl font-black text-neon'>
            {stats.totalViews}
          </p>
        </div>

        <div className='bg-zinc-900 rounded-3xl p-6'>
          <h2 className='text-zinc-400 text-lg mb-2'>
            Videos
          </h2>

          <p className='text-4xl font-black text-neon'>
            {stats.totalVideos}
          </p>
        </div>

        <div className='bg-zinc-900 rounded-3xl p-6'>
          <h2 className='text-zinc-400 text-lg mb-2'>
            Likes
          </h2>

          <p className='text-4xl font-black text-neon'>
            {stats.totalLikes}
          </p>
        </div>

      </div>

      <h2 className='text-3xl font-black mb-8'>
        Your Videos
      </h2>

      <div className='grid grid-cols-3 gap-8'>

        {videos.map((video) => (

          <div
            key={video._id}
            className='bg-zinc-900 rounded-3xl overflow-hidden'
          >

            <img
              src={video.thumbnail}
              alt={video.title}
              className='w-full h-[220px] object-cover'
            />

            <div className='p-5'>

              <h3 className='text-xl font-bold mb-2'>
                {video.title}
              </h3>

              <p className='text-zinc-400 text-sm mb-3'>
                {video.description}
              </p>

              <div className='flex justify-between text-zinc-500 text-sm'>

                <span>
                  👁 {video.views} views
                </span>

                <span>
                  {video.isPublished
                    ? 'Published'
                    : 'Private'}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}