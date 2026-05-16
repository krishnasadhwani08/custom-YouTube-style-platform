import { useState } from 'react'

import API from '../api/axios'

import {

  useNavigate,
  Link

} from 'react-router-dom'

import {

  Upload,
  UserPlus

} from 'lucide-react'

export default function Register() {

  const navigate =
    useNavigate()

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({

      fullName: '',

      username: '',

      email: '',

      password: ''
    })

  const [avatar, setAvatar] =
    useState(null)

  const [coverImage, setCoverImage] =
    useState(null)

  /* ─────────────────────────────
     Register
  ───────────────────────────── */

  const registerHandler =
    async (e) => {

      e.preventDefault()

      setLoading(true)

      try {

        const data =
          new FormData()

        data.append(
          'fullName',
          formData.fullName
        )

        data.append(
          'userName',
          formData.username
        )

        data.append(
          'email',
          formData.email
        )

        data.append(
          'password',
          formData.password
        )

        if (avatar) {

          data.append(
            'avatar',
            avatar
          )
        }

        if (coverImage) {

          data.append(
            'coverImage',
            coverImage
          )
        }

        await API.post(

          '/users/register',

          data
        )

        alert(

          'Verification email sent. Please check your inbox.'
        )

        navigate('/login')

      } catch (err) {

        console.log(

          err.response?.data ||

          err.message
        )

        alert(

          err.response?.data?.message ||

          'Registration failed'
        )

      } finally {

        setLoading(false)
      }
    }

  return (

    <div className='min-h-screen flex items-center justify-center px-6 py-12'>

      {/* Background Glow */}

      <div className='fixed inset-0 -z-10 overflow-hidden'>

        <div className='absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full' />

        <div className='absolute bottom-[-150px] right-[-120px] w-[420px] h-[420px] bg-pink-500/20 blur-[150px] rounded-full' />

      </div>

      {/* Card */}

      <form
        onSubmit={registerHandler}
        className='w-full max-w-[520px] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl'
      >

        {/* Header */}

        <div className='mb-8 text-center'>

          <div className='w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-pink-500 mx-auto flex items-center justify-center mb-5 shadow-2xl'>

            <UserPlus size={34} />

          </div>

          <h1 className='text-5xl font-black mb-3 tracking-tight'>

            Join GenZTube

          </h1>

          <p className='text-zinc-400 text-lg'>

            create your creator account

          </p>

        </div>

        {/* Full Name */}

        <div className='mb-5'>

          <label className='block text-sm text-zinc-400 mb-2 font-medium'>

            Full Name

          </label>

          <input
            type='text'
            placeholder='enter your full name'
            value={formData.fullName}
            onChange={(e) =>
              setFormData({

                ...formData,

                fullName:
                  e.target.value
              })
            }
            className='w-full rounded-2xl bg-black/30 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 transition'
          />

        </div>

        {/* Username */}

        <div className='mb-5'>

          <label className='block text-sm text-zinc-400 mb-2 font-medium'>

            Username

          </label>

          <input
            type='text'
            placeholder='choose a username'
            value={formData.username}
            onChange={(e) =>
              setFormData({

                ...formData,

                username:
                  e.target.value
              })
            }
            className='w-full rounded-2xl bg-black/30 border border-white/10 px-5 py-4 outline-none focus:border-pink-400 transition'
          />

        </div>

        {/* Email */}

        <div className='mb-5'>

          <label className='block text-sm text-zinc-400 mb-2 font-medium'>

            Email

          </label>

          <input
            type='email'
            placeholder='enter your email'
            value={formData.email}
            onChange={(e) =>
              setFormData({

                ...formData,

                email:
                  e.target.value
              })
            }
            className='w-full rounded-2xl bg-black/30 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 transition'
          />

        </div>

        {/* Password */}

        <div className='mb-6'>

          <label className='block text-sm text-zinc-400 mb-2 font-medium'>

            Password

          </label>

          <input
            type='password'
            placeholder='create a password'
            value={formData.password}
            onChange={(e) =>
              setFormData({

                ...formData,

                password:
                  e.target.value
              })
            }
            className='w-full rounded-2xl bg-black/30 border border-white/10 px-5 py-4 outline-none focus:border-pink-400 transition'
          />

        </div>

        {/* Avatar */}

        <div className='mb-5'>

          <label className='block text-sm text-zinc-400 mb-3 font-medium'>

            Avatar

          </label>

          <label className='flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-black/20 px-5 py-5 cursor-pointer hover:border-cyan-400 transition'>

            <Upload size={20} />

            <span className='text-zinc-400'>

              {
                avatar
                  ? avatar.name
                  : 'upload profile image'
              }

            </span>

            <input
              type='file'
              hidden
              onChange={(e) =>
                setAvatar(
                  e.target.files[0]
                )
              }
            />

          </label>

        </div>

        {/* Cover Image */}

        <div className='mb-8'>

          <label className='block text-sm text-zinc-400 mb-3 font-medium'>

            Cover Image

          </label>

          <label className='flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-black/20 px-5 py-5 cursor-pointer hover:border-pink-400 transition'>

            <Upload size={20} />

            <span className='text-zinc-400'>

              {
                coverImage
                  ? coverImage.name
                  : 'upload cover image'
              }

            </span>

            <input
              type='file'
              hidden
              onChange={(e) =>
                setCoverImage(
                  e.target.files[0]
                )
              }
            />

          </label>

        </div>

        {/* Button */}

        <button
          disabled={loading}
          className='w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 py-4 font-black text-lg shadow-2xl hover:scale-[1.01] transition duration-300 disabled:opacity-50 disabled:hover:scale-100'
        >

          {
            loading

              ? 'Creating Account...'

              : 'Create Account'
          }

        </button>

        {/* Footer */}

        <p className='text-center text-zinc-500 mt-8'>

          already have an account? {' '}

          <Link
            to='/login'
            className='text-cyan-400 hover:text-cyan-300 font-semibold'
          >

            login

          </Link>

        </p>

      </form>

    </div>
  )
}
