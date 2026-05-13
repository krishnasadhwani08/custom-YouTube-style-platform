
import { Bell, Search } from 'lucide-react'

export default function Navbar(){
  return(
    <div className='sticky top-0 z-50 bg-black flex justify-between items-center px-6 py-4 border-b border-zinc-800'>
      <h1 className='text-3xl font-black text-neon'>GenZTube</h1>

      <div className='bg-zinc-900 rounded-full px-4 py-2 flex items-center w-[40%]'>
        <Search size={18}/>
        <input placeholder='search memes, chaos, tutorials...' className='bg-transparent outline-none px-3 w-full'/>
      </div>

      <Bell className='cursor-pointer'/>
    </div>
  )
}
