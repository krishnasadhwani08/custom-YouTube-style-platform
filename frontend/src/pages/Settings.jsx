import { useState } from 'react'

import {

  Bell,
  Shield,
  User,
  LogOut,
  Palette,
  Sparkles

} from 'lucide-react'

import {
  useTheme
} from '../context/ThemeContext'

export default function Settings() {

  const {

    theme,
    setTheme

  } = useTheme()

  const [notifications, setNotifications] =
    useState(true)

  const logout = () => {

    localStorage.removeItem('user')

    localStorage.removeItem('accessToken')

    window.location.href = '/login'
  }

  const settingCards = [

    {
      title: 'Profile Settings',

      desc:
        'manage your account details',

      icon:
        <User size={22} />
    },

    {
      title: 'Notifications',

      desc:
        'control alerts and updates',

      icon:
        <Bell size={22} />
    },

    {
      title: 'Appearance',

      desc:
        'customize themes and visuals',

      icon:
        <Palette size={22} />
    },

    {
      title: 'Privacy & Security',

      desc:
        'secure your account',

      icon:
        <Shield size={22} />
    }
  ]

  return (

    <div className='page-wrapper fade-up'>

      <div className='max-w-6xl mx-auto'>

        {/* Header */}

        <div className='flex items-center justify-between mb-10 flex-wrap gap-4'>

          <div>

            <h1 className='page-title'>
              Settings
            </h1>

            <p className='settings-sub text-lg'>

              manage your genztube experience

            </p>

          </div>

          {/* Logout */}

          <button
            onClick={logout}
            className='bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-2xl flex items-center gap-3 font-bold shadow-lg'
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

        {/* Cards */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

          {settingCards.map((item) => (

            <div
              key={item.title}
              className='settings-card group'
            >

              {/* Icon */}

              <div className='w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300'>

                {item.icon}

              </div>

              {/* Title */}

              <h2 className='text-2xl font-black mb-2'>

                {item.title}

              </h2>

              {/* Description */}

              <p className='settings-sub'>

                {item.desc}

              </p>

            </div>

          ))}

        </div>

        {/* Notifications */}

        <div className='settings-card mt-8'>

          <div className='flex items-center justify-between flex-wrap gap-4'>

            <div>

              <h2 className='text-2xl font-black mb-1'>

                Push Notifications

              </h2>

              <p className='settings-sub'>

                receive updates for likes,
                comments and subscriptions

              </p>

            </div>

            {/* Toggle */}

            <button
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              className={`w-20 h-10 rounded-full transition duration-300 flex items-center px-1 ${
                notifications

                  ? 'bg-cyan-500 justify-end shadow-[0_0_20px_rgba(0,229,255,0.25)]'

                  : 'bg-zinc-700 justify-start'
              }`}
            >

              <div className='w-8 h-8 rounded-full bg-white shadow-md' />

            </button>

          </div>

        </div>

        {/* Theme Section */}

        <div className='settings-card mt-8'>

          <div className='flex items-center gap-4 mb-6'>

            <Sparkles className='text-cyan-400' />

            <div>

              <h2 className='text-2xl font-black'>

                Appearance

              </h2>

              <p className='settings-sub'>

                customize your vibe

              </p>

            </div>

          </div>

          {/* Theme Buttons */}

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

            {/* Light */}

            <button
              onClick={() =>
                setTheme('light')
              }
              className={`theme-btn ${
                theme === 'light'

                  ? 'theme-btn-active'

                  : ''
              }`}
            >

              ☀️ Light

            </button>

            {/* Dark */}

            <button
              onClick={() =>
                setTheme('dark')
              }
              className={`theme-btn ${
                theme === 'dark'

                  ? 'theme-btn-active'

                  : ''
              }`}
            >

              🌙 Dark

            </button>

            {/* GenZ */}

            <button
              onClick={() =>
                setTheme('genz-mode')
              }
              className={`theme-btn ${
                theme === 'genz-mode'

                  ? 'theme-btn-active-genz'

                  : ''
              }`}
            >

              ✨ GenZ

            </button>

          </div>

        </div>

        {/* Experimental Section */}

        <div className='settings-card mt-8 overflow-hidden relative'>

          {/* Glow */}

          <div className='absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl' />

          <div className='relative z-10'>

            <h2 className='text-3xl font-black mb-3 flex items-center gap-3'>

              <Sparkles className='text-pink-400' />

              GenZ Experimental UI

            </h2>

            <p className='settings-sub mb-6 max-w-2xl'>

              ultra vibrant glassmorphism mode
              engineered for maximum visual
              stimulation and terminally online
              energy

            </p>

            <div className='flex flex-wrap gap-4'>

              <div className='px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold'>

                Glassmorphism

              </div>

              <div className='px-4 py-2 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300 font-semibold'>

                Neon Glow

              </div>

              <div className='px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold'>

                RGB Atmosphere

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}