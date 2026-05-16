import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import API from '../api/axios'

export default function Home() {

  const [videos, setVideos] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchVideos()

  }, [])

  const fetchVideos = async () => {

    try {

      const res =
        await API.get('/videos')

      setVideos(
        res.data.data || []
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

  return (

    <div className='page-wrapper fade-up'>

      {/* Header */}

      <header className='page-header'>

        <div>

          <h1 className='page-title'>
            For You
          </h1>

          <p className='page-sub'>
            what's trending rn
          </p>

        </div>

        <div className='header-pill'>

          {videos.length} videos

        </div>

      </header>

      {/* Loading State */}

      {loading ? (

        <div className='skeleton-grid'>

          {[...Array(6)].map((_, i) => (

            <div
              key={i}
              className='skeleton-card'
              style={{
                animationDelay:
                  `${i * 80}ms`
              }}
            />

          ))}

        </div>

      ) : videos.length === 0 ? (

        /* Empty State */

        <div className='empty-state'>

          <h2>
            no videos yet
          </h2>

          <p>
            the algorithm is sleeping
          </p>

        </div>

      ) : (

        /* Video Grid */

        <div className='video-grid'>

          {videos.map((video, i) => (

            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className='video-card fade-up'
              style={{
                animationDelay:
                  `${i * 70}ms`
              }}
            >

              {/* Thumbnail */}

              <div className='thumbnail-wrap'>

                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className='thumbnail'
                />

                {/* Overlay */}

                <div className='thumbnail-overlay' />

                {/* Views */}

                <span className='view-badge'>

                  👁 {' '}

                  {video.views?.toLocaleString()}

                </span>

              </div>

              {/* Card Body */}

              <div className='card-body'>

                {/* Channel Row */}

                <div className='channel-row'>

                  <img
                    src={
                      video.owner?.avatar ||

                      'https://via.placeholder.com/100'
                    }
                    alt='avatar'
                    className='channel-avatar'
                  />

                  <div className='channel-meta'>

                    <h2 className='card-title'>

                      {video.title}

                    </h2>

                    <p className='card-channel'>

                      @
                      {video.owner?.userName ||
                        'unknown'}

                    </p>

                  </div>

                </div>

                {/* Footer */}

                <div className='card-footer'>

                  <span className='view-count'>

                    {video.views?.toLocaleString()}

                    {' '}views

                  </span>

                  <span className='card-date'>

                    {
                      new Date(
                        video.createdAt
                      ).toLocaleDateString(
                        'en',
                        {
                          month: 'short',
                          day: 'numeric'
                        }
                      )
                    }

                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  )
}