import React from 'react'
import Image from 'next/image'

const Review = () => {
  return (
    <div className='w-[280px] h-[80%] border rounded-[10px] px-3 py-3'>
        <div className='flex justify-between'>
            <div className='flex'>
                <span><Image src="/Icon/star.png" alt="star" width={17} height={10}></Image></span>
                <span><Image src="/Icon/star.png" alt="star" width={17} height={10}></Image></span>
                <span><Image src="/Icon/star.png" alt="star" width={17} height={10}></Image></span>
                <span><Image src="/Icon/star.png" alt="star" width={17} height={10}></Image></span>
                <span><Image src="/Icon/star.png" alt="star" width={17} height={10}></Image></span>
            </div>
            <div>
                <Image src="/Icon/Profile.png" alt='profile'width={22} height={10}></Image>
            </div>
        </div>
        <p className='text-[12px]'>3 min ago</p>
        <p className='text-[20px]'>Title</p>
        <p className='text-sm'>Great company, Love everything about them. Great customer service and really grate people. Just became funded with them really looking forward to working with them!!</p>

    </div>
  )
}

export default Review