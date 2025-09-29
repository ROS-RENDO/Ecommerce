'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const Page = () => {
  const router= useRouter();
  return (
    <div>
      <h1 className='text-[36px] font-normal w-full px-20 mt-10 py-2'>Checkout</h1>
      <div className='flex px-20 justify-between'>
        <div className=' w-[668px] h-[561px] border px-5 py-5'>
          <h1 className='text-[20px]'>Shipping Information</h1>
          <div>
            <p className='text-[16px] mt-2 py-2'>Email Address *</p>
            <input type="email" className='w-full h-[40px] border px-5 '></input>
            <div className='flex justify-between'>
              <div>
                <p className='text-[16px] mt-2 py-2'>First Name *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
              <div>
                <p className='text-[16px] mt-2 py-2'>Last Name *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
            </div>
              <p className='text-[16px] mt-2 py-2'>Street Address *</p>
              <input className='w-full h-[40px] border px-5 '></input>
            <div className='flex justify-between'>
              <div>
                <p className='text-[16px] mt-2 py-2'>City *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
              <div>
                <p className='text-[16px] mt-2 py-2'>State *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
            </div>
            <div className='flex justify-between'>
              <div>
                <p className='text-[16px] mt-2 py-2'>Zip code *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
              <div>
                <p className='text-[16px] mt-2 py-2'>Country *</p>
                <input className='w-[301] h-[40px] border px-5 '></input>
              </div>
            </div>
            <button onClick={() => router.push("/cart/checkout/payment")} className='flex justify-center items-center w-[618px] h-[31px] border mt-5 bg-gradient-to-br cursor-pointer from-blue-500 via-purple-600 to-indigo-700 '>
              <p className='text-[15px] text-white '>Continue Payment Checkout</p>
            </button>

          </div>
        </div>
        <div className=' w-[668px] h-[561px] border px-5 py-5 text-[20px]'>
          <h1>Order Summary</h1>
          <div className='flex justify-between items-center px-5'>
            <div className='flex py-5'>
              <div className='w-[64px] h-[64px] bg-[#656565]'></div>
              <div className='px-5'>
                <p className='text-[16px]'>Premium Wireless Headphones</p>
                <p className='text-[13px] text-[#575757] py-2'>Qty: 1</p>
              </div>  
            </div>
            <p>$199.99</p>
          </div>
          <div className='bg-black h-0.5 w-full'> </div>
          <div className='flex justify-between px-5 mt-5 py-2'>
            <p className='text-[#565656] text-[13px]'>Subtotal</p>
            <p className='text-[13px]'>$199.99</p>
          </div>
          <div className='flex justify-between px-5 py-3'>
            <p className='text-[#565656] text-[13px]'>Shipping (Standard)</p>
            <p className='text-[13px]'>$7.99</p>
          </div>
          <div className='bg-black h-0.5 w-full'> </div>
          <div className='flex justify-between px-5 py-3'>
            <p className='text-[#565656] text-[16px] font-bold'>Total</p>
            <p className='text-[16px] font-normal text-[#1800ED]'>$207.98</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Page