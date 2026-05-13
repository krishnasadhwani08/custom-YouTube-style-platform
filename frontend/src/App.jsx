
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Tweet from './pages/Tweet'
import WatchVideo from './pages/WatchVideo'
export default function App(){
  return(
    <BrowserRouter>
      <Navbar/>
      <Sidebar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/tweet' element={<Tweet />} />
        <Route path='/watch/:videoId' element={<WatchVideo />} />
      </Routes>
    </BrowserRouter>
  )
}
