import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import WatchVideo from './pages/WatchVideo'
import Tweets from './pages/Tweets'
import Logout from './pages/Logout'

export default function App() {

  const raw = localStorage.getItem('user')

  const user = raw
    ? JSON.parse(raw)
    : null

  const ProtectedRoute = ({
    children
  }) => {

    if (!user) {
      return <Navigate to='/login' />
    }

    return children
  }

  return (

    <BrowserRouter>

      <div className='app-shell'>

        {user && <Sidebar />}

        <main
          className={`main-content ${
            user
              ? 'with-sidebar'
              : 'full-width'
          }`}
        >

          <Routes>

            <Route
              path='/'
              element={<Home />}
            />

            <Route
              path='/login'
              element={
                user
                  ? <Navigate to='/' />
                  : <Login />
              }
            />

            <Route
              path='/register'
              element={
                user
                  ? <Navigate to='/' />
                  : <Register />
              }
            />

            <Route
              path='/watch/:videoId'
              element={<WatchVideo />}
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/upload'
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='/tweets'
              element={
                <ProtectedRoute>
                  <Tweets />
                </ProtectedRoute>
              }
            />

            <Route
              path='*'
              element={<Navigate to='/' />}
            />

            <Route
              path='/logout'
              element={<Logout />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  )
}