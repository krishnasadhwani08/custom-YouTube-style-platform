import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function Tweets() {

  const [tweets, setTweets] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {

    try {

      const response = await API.get(
        `/tweets/user/${user?._id}`
      )

      setTweets(response.data.data)

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )

    } finally {

      setLoading(false)
    }
  }

  const createTweet = async () => {

    if (!content.trim()) return

    try {

      const response = await API.post(
        '/tweets',
        { content }
      )

      setTweets([
        response.data.data,
        ...tweets
      ])

      setContent('')

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const deleteTweet = async (tweetId) => {

    try {

      await API.delete(
        `/tweets/${tweetId}`
      )

      setTweets(
        tweets.filter(
          (tweet) =>
            tweet._id !== tweetId
        )
      )

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  if (loading) {

    return (

      <div className='ml-[240px] min-h-screen bg-black text-white flex items-center justify-center text-3xl font-black'>
        Loading Tweets...
      </div>
    )
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-8'>

      <div className='max-w-3xl mx-auto'>

        <h1 className='text-5xl font-black mb-10'>
          Tweets
        </h1>

        <div className='bg-zinc-900 p-6 rounded-3xl mb-10 shadow-2xl'>

          <textarea
            value={content}
            placeholder='What is happening?'
            className='w-full h-32 bg-zinc-800 rounded-2xl p-4 outline-none resize-none'
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          <button
            onClick={createTweet}
            className='mt-4 bg-neon text-black px-8 py-3 rounded-2xl font-black'
          >
            Tweet
          </button>

        </div>

        <div className='space-y-6'>

          {tweets.map((tweet) => (

            <div
              key={tweet._id}
              className='bg-zinc-900 p-6 rounded-3xl shadow-xl'
            >

              <div className='flex items-center gap-4 mb-4'>

                <img
                  src={
                    tweet.owner?.avatar ||
                    'https://via.placeholder.com/100'
                  }
                  alt='avatar'
                  className='w-14 h-14 rounded-full object-cover'
                />

                <div>

                  <h2 className='font-black text-xl'>
                    {tweet.owner?.fullName}
                  </h2>

                  <p className='text-zinc-400'>
                    @{tweet.owner?.userName}
                  </p>

                </div>

              </div>

              <p className='text-lg leading-8 text-zinc-300 mb-6'>
                {tweet.content}
              </p>

              <div className='flex justify-between items-center'>

                <span className='text-zinc-500 text-sm'>
                  {new Date(
                    tweet.createdAt
                  ).toLocaleDateString()}
                </span>

                <button
                  onClick={() =>
                    deleteTweet(tweet._id)
                  }
                  className='bg-red-600 px-5 py-2 rounded-xl font-bold'
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}