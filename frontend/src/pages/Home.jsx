import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import API from '../api/axios'

export default function Home() {

  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {

    try {

      const response =
        await API.get('/videos')

      setVideos(response.data.data)

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-8'>

      <h1 className='text-5xl font-black mb-10'>
        GenZTube
      </h1>

      <div className='grid grid-cols-3 gap-8'>

        {videos.map((video) => (

          <Link
            key={video._id}
            to={`/watch/${video._id}`}
            className='bg-zinc-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition duration-300 shadow-2xl'
          >

            <img
              src={video.thumbnail}
              alt={video.title}
              className='w-full h-[220px] object-cover'
            />

            <div className='p-5'>

              <div className='flex items-center gap-3 mb-4'>

                <img
                  src={video.owner?.avatar}
                  alt='avatar'
                  className='w-12 h-12 rounded-full object-cover'
                />

                <div>

                  <h2 className='font-bold text-lg'>
                    {video.title}
                  </h2>

                  <p className='text-zinc-400 text-sm'>
                    @{video.owner?.userName}
                  </p>

                </div>

              </div>

              <div className='flex justify-between text-zinc-500 text-sm'>

                <span>
                  👁 {video.views} views
                </span>

                <span>
                  {new Date(
                    video.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  )
}