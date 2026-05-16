import {

  BrowserRouter,
  Routes,
  Route,
  Navigate

} from 'react-router-dom'

import Navbar from './components/Navbar'
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
import Settings from './pages/Settings'
import Verify from './pages/Verify'

/* ─────────────────────────────────────────────
   Protected Route
───────────────────────────────────────────── */

function ProtectedRoute({
  children
}) {

  const raw =
    localStorage.getItem('user')

  const user = raw
    ? JSON.parse(raw)
    : null

  if (!user) {

    return (
      <Navigate to='/login' />
    )
  }

  return children
}

export default function App() {

  const raw =
    localStorage.getItem('user')

  const user = raw
    ? JSON.parse(raw)
    : null

  return (

    <BrowserRouter>

      {/* App Container */}

      <div className='app-shell'>

        {/* Navbar */}

        <Navbar />

        {/* Layout */}

        <div className='flex w-full'>

          {/* Sidebar */}

          {user && <Sidebar />}

          {/* Main Content */}

          <main
            className={`main-content transition-all duration-300 ${
              user

                ? 'with-sidebar'

                : 'full-width'
            }`}
          >

            <div className='page-transition'>

              <Routes>

                {/* ─────────────────────────
                    Public Routes
                ───────────────────────── */}

                <Route
                  path='/'
                  element={<Home />}
                />

                <Route
                  path='/watch/:videoId'
                  element={<WatchVideo />}
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

                {/* ─────────────────────────
                    Protected Routes
                ───────────────────────── */}

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
                  path='/settings'
                  element={
                    <ProtectedRoute>

                      <Settings />

                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/logout'
                  element={
                    <ProtectedRoute>

                      <Logout />

                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/verify/:token'
                  element={<Verify />}
                />

                {/* ─────────────────────────
                    Fallback
                ───────────────────────── */}

                <Route
                  path='*'
                  element={
                    <Navigate to='/' />
                  }
                />

              </Routes>

            </div>

          </main>

        </div>

      </div>

    </BrowserRouter>
  )
}