import {

  useEffect,
  useState

} from 'react'

import {

  useNavigate,
  useParams

} from 'react-router-dom'

import {

  CheckCircle2,
  XCircle,
  Loader2

} from 'lucide-react'

import API from '../api/axios'

export default function Verify() {

  const { token } =
    useParams()

  const navigate =
    useNavigate()

  const [message, setMessage] =
    useState('Verifying your account...')

  const [status, setStatus] =
    useState('loading')

  useEffect(() => {

    if (token) {

      verifyEmail()
    }

  }, [token])

  /* ─────────────────────────────
     Verify Email
  ───────────────────────────── */

  const verifyEmail = async () => {

    try {

      console.log(
        'Verification Token:',
        token
      )

      const res =
        await API.get(

          `/users/verify/${token}`
        )

      console.log(
        'Verify Response:',
        res.data
      )

      setStatus('success')

      setMessage(

        res.data.message ||

        'Email verified successfully'
      )

      setTimeout(() => {

        navigate('/login')

      }, 3000)

    } catch (err) {

      console.log(

        'Verify Error:',

        err.response?.data ||

        err.message
      )

      setStatus('error')

      setMessage(

        err.response?.data?.message ||

        'Verification failed'
      )
    }
  }

  return (

    <div className='min-h-screen flex items-center justify-center px-6 overflow-hidden relative'>

      {/* Background Glow */}

      <div className='absolute inset-0 -z-10'>

        <div className='absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-cyan-500/20 blur-[140px] rounded-full' />

        <div className='absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] bg-pink-500/20 blur-[150px] rounded-full' />

      </div>

      {/* Card */}

      <div className='w-full max-w-lg rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center shadow-2xl'>

        {/* Icon */}

        <div className='flex justify-center mb-6'>

          {status === 'loading' && (

            <div className='w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20'>

              <Loader2
                size={42}
                className='animate-spin text-cyan-400'
              />

            </div>

          )}

          {status === 'success' && (

            <div className='w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20'>

              <CheckCircle2
                size={42}
                className='text-emerald-400'
              />

            </div>

          )}

          {status === 'error' && (

            <div className='w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20'>

              <XCircle
                size={42}
                className='text-red-400'
              />

            </div>

          )}

        </div>

        {/* Heading */}

        <h1 className='text-5xl font-black mb-4 tracking-tight'>

          Email Verification

        </h1>

        {/* Message */}

        <p className='text-zinc-400 text-lg leading-relaxed'>

          {message}

        </p>

        {/* Footer */}

        {status === 'success' && (

          <p className='mt-8 text-sm text-zinc-500'>

            redirecting to login...

          </p>

        )}

      </div>

    </div>
  )
}