import { useEffect, useState } from 'react'
import API from '../api/axios'

const STAT_CONFIG = [
  { key: 'totalSubscribers', label: 'Subscribers', icon: '👥', color: '#7c5cfc' },
  { key: 'totalViews',       label: 'Total Views',  icon: '👁',  color: '#e879f9' },
  { key: 'totalVideos',      label: 'Videos',       icon: '🎬', color: '#38bdf8' },
  { key: 'totalLikes',       label: 'Likes',        icon: '❤️',  color: '#fb7185' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])

  useEffect(() => { loadDashboard() }, [])

  const loadDashboard = async () => {
    try {
      const userRes = await API.get('/users/current-user')
      const id = userRes.data.data._id
      const [statsRes, videosRes] = await Promise.all([
        API.get(`/dashboard/stats/${id}`),
        API.get(`/dashboard/videos/${id}`)
      ])
      setStats(statsRes.data.data)
      setVideos(videosRes.data.data)
    } catch (err) {
      console.log(err.response?.data || err.message)
    }
  }

  if (!stats) return (
    <div className='page-wrapper'>
      <div className='loading-state'>
        <div className='spinner' />
        <span>loading your stats…</span>
      </div>
    </div>
  )

  return (
    <div className='page-wrapper'>
      <header className='page-header'>
        <div>
          <h1 className='page-title'>Creator Studio</h1>
          <p className='page-sub'>your numbers, your story</p>
        </div>
      </header>

      {/* Stat cards */}
      <div className='stats-grid'>
        {STAT_CONFIG.map(({ key, label, icon, color }, i) => (
          <div
            key={key}
            className='stat-card fade-up'
            style={{ animationDelay: `${i * 80}ms`, '--accent-local': color }}
          >
            <span className='stat-icon'>{icon}</span>
            <p className='stat-value'>{stats[key]?.toLocaleString() ?? 0}</p>
            <p className='stat-label'>{label}</p>
            <div className='stat-bar' />
          </div>
        ))}
      </div>

      {/* Videos */}
      <section className='section-block'>
        <h2 className='section-title'>Your Videos</h2>
        <div className='video-grid'>
          {videos.map((video, i) => (
            <div
              key={video._id}
              className='video-card dashboard-card fade-up'
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className='thumbnail-wrap'>
                <img src={video.thumbnail} alt={video.title} className='thumbnail' />
                <span className={`pub-badge ${video.isPublished ? 'pub' : 'priv'}`}>
                  {video.isPublished ? 'Live' : 'Private'}
                </span>
              </div>
              <div className='card-body'>
                <h3 className='card-title'>{video.title}</h3>
                <p className='card-desc'>{video.description}</p>
                <div className='card-footer'>
                  <span className='view-count'>👁 {video.views?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}