
export default function VideoCard({video}){
  return(
    <div className='bg-zinc-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition'>
      <img
        src={video.thumbnail || 'https://picsum.photos/500/300'}
        className='w-full h-[220px] object-cover'
      />

      <div className='p-4'>
        <h2 className='font-bold text-lg'>{video.title}</h2>
        <p className='text-zinc-400 text-sm mt-2'>
          {video.owner?.fullName || 'Anonymous Internet Creature'}
        </p>
      </div>
    </div>
  )
}
