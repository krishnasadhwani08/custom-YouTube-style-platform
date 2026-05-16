import {

  Link,
  useLocation

} from 'react-router-dom'

import {

  FaHome,
  FaTwitter,
  FaVideo,
  FaCompass,
  FaFire,
  FaMusic

} from 'react-icons/fa'

export default function Sidebar() {

  const location = useLocation()

  const menus = [

    {
      name: 'Home',
      path: '/',
      icon: FaHome
    },

    {
      name: 'Trending',
      path: '/trending',
      icon: FaFire
    },

    {
      name: 'Explore',
      path: '/explore',
      icon: FaCompass
    },

    {
      name: 'Tweets',
      path: '/tweets',
      icon: FaTwitter
    },

    {
      name: 'Music',
      path: '/music',
      icon: FaMusic
    },

    {
      name: 'Upload',
      path: '/upload',
      icon: FaVideo
    }
  ]

  return (

    <aside className='fixed top-[90px] left-0 h-[calc(100vh-90px)] w-[250px] bg-[#0b0b0b]/95 backdrop-blur-xl border-r border-zinc-800 z-40 overflow-y-auto'>

      {/* Top */}

      <div className='px-5 py-6 border-b border-zinc-800'>

        <h2 className='text-zinc-400 text-sm uppercase tracking-[0.2em] font-bold mb-2'>
          Discover
        </h2>

        <p className='text-zinc-500 text-sm leading-relaxed'>
          curated chaos for the terminally online
        </p>

      </div>

      {/* Navigation */}

      <nav className='flex flex-col gap-3 p-4'>

        {menus.map((menu) => {

          const Icon = menu.icon

          const active =
            location.pathname === menu.path

          return (

            <Link
              key={menu.name}
              to={menu.path}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 overflow-hidden ${
                active

                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/20'

                  : 'hover:bg-zinc-900 text-white'
              }`}
            >

              {/* Glow */}

              {active && (

                <div className='absolute inset-0 bg-white/10 blur-2xl opacity-40' />

              )}

              {/* Icon */}

              <div className={`relative z-10 transition duration-300 ${
                active
                  ? 'scale-110'
                  : 'group-hover:scale-110'
              }`}>

                <Icon size={20} />

              </div>

              {/* Text */}

              <span className='relative z-10 font-semibold tracking-wide'>

                {menu.name}

              </span>

            </Link>
          )
        })}

      </nav>

      {/* Bottom Card */}

      <div className='p-4 mt-4'>

        <div className='bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 border border-cyan-500/20 rounded-3xl p-5 backdrop-blur-xl'>

          <h3 className='font-black text-lg mb-2'>
            GenZ Mode
          </h3>

          <p className='text-zinc-300 text-sm leading-relaxed mb-4'>
            ultra vibrant UI mode engineered for maximum dopamine stimulation
          </p>

          <button className='w-full bg-white text-black font-bold py-3 rounded-2xl hover:scale-[1.02] transition duration-300'>

            Activated

          </button>

        </div>

      </div>

    </aside>
  )
}