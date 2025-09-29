import React from 'react'
import Newarrivalcard from '@/components/ui/newarrivalcard'
import Image from 'next/image'
const page = () => {
  return (
    <div>
      <div className='w-full h-[326px] flex flex-col justify-self-start items-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700'>
        <Image src="/Icon/stararrival.png" alt="champion" width={99} height={99} className='py-5'/>
        <div className='font-extrabold text-[48px] text-white '>New Arrival</div>
        <div className='font-normal text-[15px] text-white'>Our most products loved by thousand of customers</div>
      </div>
      <div className='px-10 py-5 flex gap-8'>
        <Newarrivalcard/>
        <Newarrivalcard/>
        <Newarrivalcard/>
        <Newarrivalcard/>
      </div>
    </div>
  )
}

export default page