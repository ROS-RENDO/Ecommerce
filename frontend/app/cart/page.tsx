'use client'
import React from 'react'
import  {useState} from 'react'
import CardComponent from '@/components/ui/CartComponent'
import { useRouter } from 'next/navigation'
import { products } from '@/data/products'
import AuthWrapper from '@/context/AuthContext'
const Page = () => {
  const [selectedShipping, setSelectedShipping] = useState('')
  const router= useRouter();
  return (
    <AuthWrapper>
      <div>
        <div className='w-full h-[120px] flex justify-center items-center '>
          <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
            <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
              CART
            </h1>
          </div>
        </div>
        <h1 className='text-[36px] font-normal w-full px-20 '>Shopping Cart</h1>
        <div className='flex justify-between '>
          <div>
            {products.electronics.map((product)=>(
              <CardComponent key={product.id} name={product.name} price={product.price} image={product.image}/>
            ))}
          </div>
          <div className='w-[434px] h-[430px] bg-white border border-black mr-25'>
            <h1 className='p-5 text-[24px]'>Order Summary</h1>
            <div className='w-full flex justify-between px-5'>
              <h1 className='text-[16px]'>Subtotal (1items)</h1>
              <p>$199.99</p>
            </div>
            <div className='p-5'>
              <h1 className='text-[20px]'>Shipping Method</h1>
              <div className='flex flex-col'>
                <div className='flex gap-2 cursor-pointer' onClick={() => setSelectedShipping('standard')}>
                  <div className='w-[20px] h-[20px] rounded-full border border-black relative '>
                    {selectedShipping === 'standard' && (
                      <div className='w-[12px] h-[12px] rounded-full bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
                    )}
                  </div>
                  <p>Standard (5-7 days) - $7.99</p>
                </div>
                <div className='flex gap-2 cursor-pointer' onClick={() => setSelectedShipping('express')}>
                  <div className='w-[20px] h-[20px] rounded-full border border-black relative'>
                    {selectedShipping === 'express' && (
                      <div className='w-[12px] h-[12px] rounded-full bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
                    )}
                  </div>
                  <p>Express (2-3 days) - $15.99</p>
                </div>
              </div>
              <div className='flex justify-between items-center mt-3'>
                  <p className='ml-3'>Shipping</p>
                  <p>$7.99</p>
              </div>
              <div className='w-[397px] h-0.5 bg-black mt-3'></div>
              <div className='flex justify-between items-center mt-3'>
                  <p className='font-bold'>Total</p>
                  <p className='text-[#3F59CC] text-[20px]'>$207.99</p>
              </div>
                  
              <div className='mt-15 flex flex-col gap-2'>
                <button className='w-[392px] h-[31px] flex justify-center items-center cursor-pointer border 
                  bg-[radial-gradient(circle,rgba(63,94,251,1)_0%,rgba(204,0,255,1)_100%)] text-white' onClick={()=> router.push('/cart/checkout')}>
                  <p>Proceed to checkout</p>
                </button>
                <div className='w-[392px] h-[31px] flex justify-center items-center border'>
                    <p>Continue to shopping</p>
                </div>
              </div>
                  
            </div>
                  
                  
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}

export default Page