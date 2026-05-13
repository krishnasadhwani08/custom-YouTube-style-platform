
export default function Sidebar(){
  const menus=['Home','Trending','Subscriptions','Profile']

  return(
    <div className='fixed left-0 top-0 h-screen w-[220px] bg-[#111] pt-24 px-4 border-r border-zinc-800'>
      {menus.map(menu=>(
        <div key={menu} className='p-4 rounded-xl hover:bg-zinc-900 cursor-pointer mb-2'>
          {menu}
        </div>
      ))}
    </div>
  )
}
