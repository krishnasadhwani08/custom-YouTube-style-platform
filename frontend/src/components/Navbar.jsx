import {

  useState

} from 'react'

import {

  Bell,
  Search,
  Settings,
  X,
  User,
  LayoutDashboard,
  LogOut,
  LogIn

} from 'lucide-react'

import { Link }
from 'react-router-dom'

import {
  useTheme
} from '../context/ThemeContext'

export default function Navbar() {

  const [openMenu, setOpenMenu] =
    useState(false)

  const {
    theme,
    setTheme
  } = useTheme()

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const logout = () => {

    localStorage.removeItem('user')

    localStorage.removeItem('accessToken')

    window.location.href = '/login'
  }

  return (

    <>

      {/* Navbar */}

      <div className='fixed top-0 left-0 w-full h-[78px] z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800 flex justify-between items-center px-8'>

        {/* Logo */}

        <div className='flex items-center gap-4'>

          <h1 className='text-3xl font-black tracking-tight logo-text'>
            GenZTube
          </h1>

        </div>

        {/* Search */}

        <div className='hidden md:flex bg-zinc-900/80 rounded-full px-5 py-3 items-center w-[42%] border border-zinc-800 shadow-glow'>

          <Search
            size={18}
            className='text-zinc-400'
          />

          <input
            placeholder='search memes, chaos, tutorials...'
            className='bg-transparent outline-none px-3 w-full text-white placeholder:text-zinc-500'
          />

        </div>

        {/* Right Side */}

        <div className='flex items-center gap-4'>

          {/* Bell */}

          <button className='p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition relative border border-zinc-800'>

            <Bell size={20} />

            <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse' />

          </button>

          {/* Settings */}

          <button
            onClick={() =>
              setOpenMenu(true)
            }
            className='p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition border border-zinc-800'
          >

            <Settings size={20} />

          </button>

        </div>

      </div>

      {/* Settings Sidebar */}

      <div className={`fixed top-0 right-0 h-screen w-[340px] bg-[#0b0b0b]/95 backdrop-blur-2xl border-l border-zinc-800 z-[100] transition duration-300 overflow-y-auto ${
        openMenu
          ? 'translate-x-0'
          : 'translate-x-full'
      }`}>

        {/* Header */}

        <div className='flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-[#0b0b0b]/90 backdrop-blur-xl'>

          <div>

            <h2 className='text-3xl font-black'>
              Menu
            </h2>

            <p className='text-zinc-500 text-sm mt-1'>
              customize your experience
            </p>

          </div>

          <button
            onClick={() =>
              setOpenMenu(false)
            }
            className='p-2 rounded-xl hover:bg-zinc-800 transition'
          >

            <X />

          </button>

        </div>

        {/* Menu */}

        <div className='p-5 flex flex-col gap-4'>

          {/* Settings */}

          <Link
            to='/settings'
            onClick={() =>
              setOpenMenu(false)
            }
            className='bg-zinc-900 hover:bg-zinc-800 transition rounded-3xl p-5 flex items-center gap-4 border border-zinc-800'
          >

            <Settings />

            <span className='font-bold text-lg'>
              Settings
            </span>

          </Link>

          {/* Profile */}

          {user && (

            <Link
              to='/profile'
              onClick={() =>
                setOpenMenu(false)
              }
              className='bg-zinc-900 hover:bg-zinc-800 transition rounded-3xl p-5 flex items-center gap-4 border border-zinc-800'
            >

              <User />

              <span className='font-bold text-lg'>
                Profile
              </span>

            </Link>

          )}

          {/* Dashboard */}

          {user && (

            <Link
              to='/dashboard'
              onClick={() =>
                setOpenMenu(false)
              }
              className='bg-zinc-900 hover:bg-zinc-800 transition rounded-3xl p-5 flex items-center gap-4 border border-zinc-800'
            >

              <LayoutDashboard />

              <span className='font-bold text-lg'>
                Dashboard
              </span>

            </Link>

          )}

          {/* Theme Section */}

          <div className='bg-zinc-900 rounded-3xl p-5 border border-zinc-800'>

            <h3 className='font-black text-xl mb-4'>
              Theme Modes
            </h3>

            <div className='flex flex-col gap-3'>

              {/* Light */}

              <button
                onClick={() =>
                  setTheme('light')
                }
                className={`p-4 rounded-2xl font-bold transition ${
                  theme === 'light'

                    ? 'bg-yellow-400 text-black'

                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >

                ☀️ Light Mode

              </button>

              {/* Dark */}

              <button
                onClick={() =>
                  setTheme('dark')
                }
                className={`p-4 rounded-2xl font-bold transition ${
                  theme === 'dark'

                    ? 'bg-cyan-500 text-black'

                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >

                🌙 Dark Mode

              </button>

              {/* GenZ */}

              <button
                onClick={() =>
                  setTheme('genz-mode')
                }
                className={`p-4 rounded-2xl font-bold transition ${
                  theme === 'genz-mode'

                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-glow'

                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >

                ✨ GenZ Mode

              </button>

            </div>

          </div>

          {/* Login / Logout */}

          {!user ? (

            <Link
              to='/login'
              onClick={() =>
                setOpenMenu(false)
              }
              className='bg-cyan-500 hover:bg-cyan-400 transition rounded-3xl p-5 flex items-center gap-4 text-black font-bold'
            >

              <LogIn />

              Login

            </Link>

          ) : (

            <button
              onClick={logout}
              className='bg-red-500 hover:bg-red-600 transition rounded-3xl p-5 flex items-center gap-4 font-bold'
            >

              <LogOut />

              Logout

            </button>

          )}

        </div>

      </div>

      {/* Overlay */}

      {openMenu && (

        <div
          onClick={() =>
            setOpenMenu(false)
          }
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]'
        />

      )}

    </>

  )
}