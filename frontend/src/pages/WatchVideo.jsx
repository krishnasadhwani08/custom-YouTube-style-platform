import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import API from '../api/axios'

export default function WatchVideo() {

  const { videoId } = useParams()

  const [video, setVideo] = useState(null)

  const [comment, setComment] = useState('')

  const [comments, setComments] = useState([])

  const [liked, setLiked] = useState(false)

  const [subscribed, setSubscribed] = useState(false)

  const [likeCount, setLikeCount] = useState(0)

  const [subscriberCount, setSubscriberCount] =
    useState(0)

  useEffect(() => {
    fetchVideo()
  }, [videoId])

  const fetchVideo = async () => {

    try {

      const response =
        await API.get(`/videos/${videoId}`)

      const fetchedVideo =
        response.data.data

      setVideo(fetchedVideo)

      setLikeCount(
        fetchedVideo.likesCount || 0
      )

      setSubscriberCount(
        fetchedVideo.subscribersCount || 0
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const toggleLike = async () => {

    try {

      const response =
        await API.post(
          `/likes/toggle/v/${video._id}`
        )

      setLiked(
        response.data.data.liked
      )

      setLikeCount(
        response.data.data.likeCount
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const toggleSubscribe = async () => {

    try {

      const response =
        await API.post(
          `/subscriptions/toggle/${video.owner._id}`
        )

      setSubscribed(
        response.data.data.subscribed
      )

      setSubscriberCount(
        response.data.data.subscriberCount
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const addComment = () => {

    if (!comment.trim()) return

    const newComment = {
      _id: Date.now(),
      content: comment,
      owner: {
        fullName: 'You'
      }
    }

    setComments([
      newComment,
      ...comments
    ])

    setComment('')
  }

  if (!video) {

    return (

      <div className='ml-[240px] min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold'>

        Loading Video...

      </div>
    )
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-8'>

      <div className='max-w-6xl mx-auto'>

        <div className='bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl mb-8'>

          <video
            controls
            autoPlay
            className='w-full bg-black max-h-[75vh]'
          >

            <source
              src={video.videoFile}
              type='video/mp4'
            />

            Your browser does not support video.

          </video>

        </div>

        <h1 className='text-4xl font-black mb-6'>

          {video.title}

        </h1>

        <div className='flex items-center justify-between mb-8 flex-wrap gap-6'>

          <div className='flex items-center gap-4'>

            <img
              src={
                video.owner?.avatar ||
                'https://via.placeholder.com/100'
              }
              alt='avatar'
              className='w-16 h-16 rounded-full object-cover'
            />

            <div>

              <h2 className='text-2xl font-black'>

                {video.owner?.fullName}

              </h2>

              <p className='text-zinc-400'>

                @{video.owner?.userName}

              </p>

              <p className='text-zinc-500 text-sm mt-1'>

                {subscriberCount} subscribers

              </p>

            </div>

          </div>

          <div className='flex items-center gap-4'>

            <button
              onClick={toggleLike}
              className={`px-6 py-3 rounded-2xl font-bold transition ${
                liked
                  ? 'bg-pink-500'
                  : 'bg-zinc-800'
              }`}
            >

              ❤️ Like ({likeCount})

            </button>

            <button
              onClick={toggleSubscribe}
              className={`px-6 py-3 rounded-2xl font-bold transition ${
                subscribed
                  ? 'bg-zinc-700'
                  : 'bg-red-600'
              }`}
            >

              {subscribed
                ? 'Subscribed'
                : 'Subscribe'}

            </button>

          </div>

        </div>

        <div className='bg-zinc-900 p-6 rounded-3xl mb-10'>

          <div className='flex justify-between mb-4 text-zinc-400'>

            <span>

              👁 {video.views} views

            </span>

            <span>

              {new Date(
                video.createdAt
              ).toLocaleDateString()}

            </span>

          </div>

          <p className='text-zinc-300 leading-8 text-lg'>

            {video.description}

          </p>

        </div>

        <div className='bg-zinc-900 p-6 rounded-3xl'>

          <h2 className='text-3xl font-black mb-6'>

            Comments

          </h2>

          <div className='flex gap-4 mb-8'>

            <input
              type='text'
              value={comment}
              placeholder='Add a comment...'
              className='flex-1 bg-zinc-800 rounded-2xl p-4 outline-none'
              onChange={(e) =>
                setComment(e.target.value)
              }
            />

            <button
              onClick={addComment}
              className='bg-neon px-8 rounded-2xl font-bold'
            >

              Post

            </button>

          </div>

          <div className='space-y-6'>

            {comments.map((comment) => (

              <div
                key={comment._id}
                className='bg-zinc-800 p-5 rounded-2xl'
              >

                <h3 className='font-bold mb-2'>

                  {comment.owner.fullName}

                </h3>

                <p className='text-zinc-300'>

                  {comment.content}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}