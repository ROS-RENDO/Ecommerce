import React from 'react'
import Image from 'next/image';
import { CartItem } from '@/types/cart';

interface CheckoutCardProps{
    items?: CartItem[];
}

const CheckoutCard : React.FC<CheckoutCardProps>= ({items}) => {
  return (
    <>
        {items?.map(item=>(

            <div key={item._id} className='flex justify-between items-center px-5'>
            <div className='flex py-5'>
            <div className='w-[64px] h-[64px] bg-white relative flex justify-center items-center overflow-hidden'>
                <Image src={item.product.images[0]?.url || "default.png"} alt={item.product.name} width={1000} height={1000} className='w-auto h-17 object-cover absolute'></Image>
            </div>
            <div className='px-5'>
                <p className='text-[16px]'>{item.product.name}</p>
                <p className='text-[13px] text-[#575757] py-2'>Qty: {item.quantity}</p>
            </div>  
            </div>
                <p>{item.quantity*item.product.price}$</p>
        </div>
        ))}
    </>

  )
}

export default CheckoutCard