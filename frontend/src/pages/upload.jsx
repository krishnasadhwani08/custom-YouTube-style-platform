import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Upload() {

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)

  const uploadHandler = async (e) => {

    e.preventDefault()

    try {

      const data = new FormData()

      data.append('title', title)
      data.append('description', description)

      if (video) {
        data.append('video', video)
      }

      if (thumbnail) {
        data.append('thumbnail', thumbnail)
      }

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1])
      }

      const response = await API.post(
        '/videos/upload',
        data
      )

      console.log(response.data)

      alert('Video uploaded successfully')

      navigate('/')

    } catch (err) {

      console.log(err.response?.data || err.message)

      alert('Upload failed')
    }
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-10'>

      <div className='max-w-2xl mx-auto bg-zinc-900 p-8 rounded-3xl shadow-2xl'>

        <h1 className='text-4xl font-black text-neon mb-8'>
          Upload Video
        </h1>

        <form onSubmit={uploadHandler}>

          <input
            type='text'
            placeholder='Video Title'
            className='w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none'
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder='Description'
            className='w-full p-4 rounded-xl bg-zinc-800 mb-6 h-32 outline-none'
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className='block text-zinc-400 mb-2'>
            Upload Video
          </label>

          <input
            type='file'
            accept='video/*'
            className='mb-6'
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <label className='block text-zinc-400 mb-2'>
            Upload Thumbnail
          </label>

          <input
            type='file'
            accept='image/*'
            className='mb-8'
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button
            className='w-full bg-neon py-4 rounded-xl font-bold text-lg hover:opacity-90 transition'
          >
            Upload
          </button>

        </form>

      </div>

    </div>
  )
}