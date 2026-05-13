import { useEffect, useState } from 'react'

import API from '../api/axios'

export default function Tweets() {

  const [content, setContent] = useState('')

  const [tweets, setTweets] = useState([])

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {

    try {

      const userRes =
        await API.get('/users/current-user')

      const userId =
        userRes.data.data._id

      const tweetRes =
        await API.get(`/tweets/user/${userId}`)

      setTweets(tweetRes.data.data)

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const createTweet = async () => {

    try {

      await API.post('/tweets', {
        content
      })

      setContent('')

      fetchTweets()

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  const deleteTweet = async (tweetId) => {

    try {

      await API.delete(`/tweets/${tweetId}`)

      fetchTweets()

    } catch (err) {

      console.log(
        err.response?.data || err.message
      )
    }
  }

  return (

    <div className='ml-[240px] min-h-screen bg-black text-white p-10'>

      <h1 className='text-5xl font-black mb-10'>
        Tweets
      </h1>

      <div className='bg-zinc-900 p-6 rounded-3xl mb-10'>

        <textarea
          value={content}
          placeholder='What is happening?'
          className='w-full h-32 bg-zinc-800 rounded-2xl p-4 outline-none mb-4'
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <button
          onClick={createTweet}
          className='bg-neon px-8 py-3 rounded-2xl font-bold'
        >
          Tweet
        </button>

      </div>

      <div className='space-y-6'>

        {tweets.map((tweet) => (

          <div
            key={tweet._id}
            className='bg-zinc-900 p-6 rounded-3xl'
          >

            <p className='text-lg mb-4'>
              {tweet.content}
            </p>

            <div className='flex justify-between items-center'>

              <span className='text-zinc-500 text-sm'>

                {new Date(
                  tweet.createdAt
                ).toLocaleString()}

              </span>

              <button
                onClick={() =>
                  deleteTweet(tweet._id)
                }
                className='text-red-500'
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}