import React from 'react'
import Image from 'next/image'
import PaymentPage from '@/components/Paymentpage'
const page = () => {
  return (
    <div>
        <h1 className='font-bold text-[36px] tracking-[0.09em] px-50 mt-20'>CHECK OUT</h1>
        <div className='w-[682px] h-0.5 bg-black mt-2 ml-50' ></div>
        <div className='w-[1091px] h-[1258px] border ml-50 p-10 mt-5 flex flex-col gap-10'>
            <div className='flex relative'>
                <div className='w-[232px] h-[168px] border'></div>
                <div className='px-3'>
                    <h2> ROG STRIX - Tech Company</h2>
                    <p>Color: <span className='w-[15px] h-[15px] inline-block rounded-full bg-black border align-middle mb-1 '></span>Black</p>
                    <p>$2000</p>
                    <p>Qty: 10</p>
                </div>
                <Image src="/assets/trash.png" alt='trash' width={10} height={10} className='w-[25px] h-[28px] absolute bottom-0 right-0'></Image>
            </div>
            <div className='flex relative '>
                <div className='w-[232px] h-[168px] border'></div>
                <div className='px-3'>
                    <h2> ROG STRIX - Tech Company</h2>
                    <p>Color: <span className='w-[15px] h-[15px] inline-block rounded-full bg-black border align-middle mb-1 '></span>Black</p>
                    <p>$2000</p>
                    <p>Qty: 10</p>
                </div>
                <Image src="/assets/trash.png" alt='trash' width={10} height={10} className='w-[25px] h-[28px] absolute bottom-0 right-0'></Image>
            </div>
            <div className='flex relative '>
                <div className='w-[232px] h-[168px] border'></div>
                <div className='px-3'>
                    <h2> ROG STRIX - Tech Company</h2>
                    <p>Color: <span className='w-[15px] h-[15px] inline-block rounded-full bg-black border align-middle mb-1 '></span>Black</p>
                    <p>$2000</p>
                    <p>Qty: 10</p>
                </div>
                <Image src="/assets/trash.png" alt='trash' width={10} height={10} className='w-[25px] h-[28px] absolute bottom-0 right-0'></Image>
            </div>
            <div className='flex relative '>
                <div className='w-[232px] h-[168px] border'></div>
                <div className='px-3'>
                    <h2> ROG STRIX - Tech Company</h2>
                    <p>Color: <span className='w-[15px] h-[15px] inline-block rounded-full bg-black border align-middle mb-1 '></span>Black</p>
                    <p>$2000</p>
                    <p>Qty: 10</p>
                </div>
                <Image src="/assets/trash.png" alt='trash' width={10} height={10} className='w-[25px] h-[28px] absolute bottom-0 right-0'></Image>
            </div>
        </div>

        <div className='px-50'>
            <h2 className='font-bold text-[32px]'>Shipping</h2>
            <p className='font-light text-[30px]'>Ros Rendo</p>
            <p className='font-light text-[25px]'>CamTech Street, Sangkat Prek Tasek, Khan Chroy Chongvar Phnom Penh Phnom penh, 121003</p>
            <h2 className='font-bold text-[32px]'>Standard Shipping Fee</h2>
            <p>Arrive Sunday, July 15</p>
            <div className='w-[1262.01px] h-0.5 bg-black'></div>
            <h2 className='font-bold text-[32px]'>Payment Method</h2>
            <PaymentPage/>
            
        </div>


    </div>
  )
}

export default page