import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import API from '../api/axios'

export default function WatchVideo() {

  const { videoId } = useParams()

  const [video, setVideo] = useState(null)

  const [comment, setComment] = useState('')

  const [comments, setComments] = useState([])

  const [liked, setLiked] = useState(false)

  const [subscribed, setSubscribed] =
    useState(false)

  const [likeCount, setLikeCount] =
    useState(0)

  const [
    subscriberCount,
    setSubscriberCount
  ] = useState(0)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    fetchVideo()

    fetchComments()

  }, [videoId])

  /* ─────────────────────────────────────────────
     Fetch Video
  ───────────────────────────────────────────── */

  const fetchVideo = async () => {

    try {

      const response =
        await API.get(
          `/videos/${videoId}`
        )

      const fetchedVideo =
        response.data.data

      setVideo(fetchedVideo)

      setLikeCount(
        fetchedVideo.likesCount || 0
      )

      setSubscriberCount(
        fetchedVideo.subscribersCount || 0
      )

      setLiked(
        fetchedVideo.isLiked || false
      )

      setSubscribed(
        fetchedVideo.isSubscribed || false
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )

    } finally {

      setLoading(false)
    }
  }

  /* ─────────────────────────────────────────────
     Fetch Comments
  ───────────────────────────────────────────── */

  const fetchComments = async () => {

    try {

      const response =
        await API.get(
          `/comments/${videoId}`
        )

      setComments(
        response.data.data
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  /* ─────────────────────────────────────────────
     Toggle Video Like
  ───────────────────────────────────────────── */

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

  /* ─────────────────────────────────────────────
     Toggle Subscribe
  ───────────────────────────────────────────── */

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
        response.data.data
          .subscriberCount
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  /* ─────────────────────────────────────────────
     Add Comment
  ───────────────────────────────────────────── */

  const addComment = async () => {

    if (!comment.trim()) return

    try {

      const response =
        await API.post(
          `/comments/${video._id}`,
          {
            content: comment
          }
        )

      setComments([
        response.data.data,
        ...comments
      ])

      setComment('')

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  /* ─────────────────────────────────────────────
     Toggle Comment Like
  ───────────────────────────────────────────── */

  const toggleCommentLike =
  async (commentId) => {

    try {

      const response =
        await API.post(
          `/likes/toggle/c/${commentId}`
        )

      setComments(

        comments.map((comment) =>

          comment._id === commentId

            ? {

                ...comment,

                isLiked:
                  response.data.data.liked,

                likesCount:
                  response.data.data
                    .likeCount
              }

            : comment
        )
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  /* ─────────────────────────────────────────────
     Loading State
  ───────────────────────────────────────────── */

  if (loading) {

    return (

      <div className='loading'>

        <div className='spinner' />

      </div>
    )
  }

  /* ─────────────────────────────────────────────
     Video Missing
  ───────────────────────────────────────────── */

  if (!video) {

    return (

      <div className='page-wrapper'>

        <div className='glass-card p-10 text-center'>

          <h2 className='text-3xl font-bold mb-4'>

            Video not found

          </h2>

        </div>

      </div>
    )
  }

  return (

    <div className='page-wrapper fade-up'>

      <div className='max-w-6xl mx-auto'>

        {/* Video */}

        <div className='glass-card overflow-hidden mb-8'>

          <video
            controls
            autoPlay
            className='w-full bg-black max-h-[75vh]'
          >

            <source
              src={video.videoFile}
              type='video/mp4'
            />

          </video>

        </div>

        {/* Title */}

        <h1 className='text-4xl font-black mb-6'>

          {video.title}

        </h1>

        {/* Owner */}

        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8'>

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

          {/* Buttons */}

          <div className='flex items-center gap-4 flex-wrap'>

            <button
              onClick={toggleLike}
              className={`px-6 py-3 rounded-2xl font-bold transition ${
                liked
                  ? 'bg-pink-500'
                  : 'bg-zinc-800'
              }`}
            >

              Like ({likeCount})

            </button>

            <button
              onClick={toggleSubscribe}
              className={`px-6 py-3 rounded-2xl font-bold transition ${
                subscribed
                  ? 'bg-zinc-700'
                  : 'bg-red-600'
              }`}
            >

              {
                subscribed
                  ? 'Subscribed'
                  : 'Subscribe'
              }

            </button>

          </div>

        </div>

        {/* Description */}

        <div className='glass-card p-6 mb-10'>

          <div className='flex justify-between mb-4 text-zinc-400 flex-wrap gap-3'>

            <span>

              👁 {video.views} views

            </span>

            <span>

              {
                new Date(
                  video.createdAt
                ).toLocaleDateString()
              }

            </span>

          </div>

          <p className='text-zinc-300 leading-8 text-lg'>

            {video.description}

          </p>

        </div>

        {/* Comments */}

        <div className='glass-card p-6'>

          <h2 className='text-3xl font-black mb-6'>

            Comments ({comments.length})

          </h2>

          {/* Add Comment */}

          <div className='flex gap-4 mb-8 flex-col md:flex-row'>

            <input
              type='text'
              value={comment}
              placeholder='Add a comment...'
              className='flex-1 bg-zinc-800 rounded-2xl p-4 outline-none border border-zinc-700'
              onChange={(e) =>
                setComment(e.target.value)
              }
            />

            <button
              onClick={addComment}
              className='btn-primary'
            >

              Post

            </button>

          </div>

          {/* Comment List */}

          <div className='space-y-6'>

            {comments.length === 0 ? (

              <div className='text-zinc-500 text-center py-10'>

                No comments yet

              </div>

            ) : (

              comments.map((comment) => (

                <div
                  key={comment._id}
                  className='bg-zinc-900 p-5 rounded-2xl border border-zinc-800'
                >

                  <div className='flex items-center gap-3 mb-3'>

                    <img
                      src={
                        comment.user?.avatar ||
                        'https://via.placeholder.com/50'
                      }
                      alt='avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />

                    <div>

                      <h3 className='font-bold'>

                        {
                          comment.user?.fullName
                        }

                      </h3>

                      <p className='text-zinc-500 text-sm'>

                        @
                        {
                          comment.user?.userName
                        }

                      </p>

                    </div>

                  </div>

                  <p className='text-zinc-300 leading-7 mb-4'>

                    {comment.content}

                  </p>

                  <button
                    onClick={() =>
                      toggleCommentLike(
                        comment._id
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                      comment.isLiked
                        ? 'bg-pink-500'
                        : 'bg-zinc-800'
                    }`}
                  >

                     {
                      comment.likesCount || 0
                    }

                  </button>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  )
}