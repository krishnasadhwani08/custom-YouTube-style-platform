import { Link, useLocation } from 'react-router-dom'
import {
  FaHome,
  FaFire,
  FaUser,
  FaVideo,
  FaTwitter
} from 'react-icons/fa'

const menus = [
  { name: 'Home',      path: '/',          icon: FaHome    },
  { name: 'Dashboard', path: '/dashboard', icon: FaFire    },
  { name: 'Tweets',    path: '/tweets',    icon: FaTwitter },
  { name: 'Upload',    path: '/upload',    icon: FaVideo   },
  { name: 'Profile',   path: '/profile',   icon: FaUser    },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className='sidebar'>
      {/* Wordmark */}
      <div className='sidebar-brand'>
        <span className='sidebar-logo-mark'>G</span>
        <span className='sidebar-wordmark'>GenZTube</span>
      </div>

      {/* Nav */}
      <nav className='sidebar-nav'>
        {menus.map(({ name, path, icon: Icon }, i) => {
          const active = pathname === path
          return (
            <Link
              key={name}
              to={path}
              className={`sidebar-link ${active ? 'sidebar-link--active' : ''}`}
              style={{ animationDelay: `${i * 55}ms` }}
              title={name}
            >
              <span className='sidebar-icon'>
                <Icon />
              </span>
              <span className='sidebar-label'>{name}</span>
              {active && <span className='sidebar-active-dot' />}
            </Link>
          )
        })}
      </nav>

      {/* Footer glow accent */}
      <div className='sidebar-glow' />
    </aside>
  )
}