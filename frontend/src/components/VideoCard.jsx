import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className='video-card'
    >
      <div className='thumbnail-wrap'>
        <img
          src={video.thumbnail || 'https://picsum.photos/500/300'}
          alt={video.title}
          className='thumbnail'
        />
        <div className='thumbnail-overlay' />
        {video.views != null && (
          <span className='view-badge'>
            👁 {Number(video.views).toLocaleString()}
          </span>
        )}
      </div>

      <div className='card-body'>
        <div className='card-meta'>
          {video.owner?.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName}
              className='avatar-sm'
            />
          )}
          <div className='card-text'>
            <h2 className='card-title'>{video.title}</h2>
            <p className='card-channel'>
              {video.owner?.fullName || 'Anonymous Internet Creature'}
            </p>
          </div>
        </div>

        {video.createdAt && (
          <span className='card-date'>
            {new Date(video.createdAt).toLocaleDateString('en', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </Link>
  )
}