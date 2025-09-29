import React from 'react'
import Bestsellercard from '@/components/ui/bestsellercard'
import Image from 'next/image'
const page = () => {
  return (
    <div>
      <div className='w-full h-[326px] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex flex-col justify-self-start items-center'>
        <Image src="/Icon/champion.png" alt="champion" width={99} height={99} className='py-5'/>
        <div className='font-extrabold text-[48px] text-white '>Best Sellers</div>
        <div className='font-normal text-[15px] text-white'>Our most products loved by thousand of customers</div>
      </div>
      <div className='px-10 py-5 flex gap-8'>
        <Bestsellercard/>
        <Bestsellercard/>
        <Bestsellercard/>
        <Bestsellercard/>
      </div>
    </div>
  )
}

export default page