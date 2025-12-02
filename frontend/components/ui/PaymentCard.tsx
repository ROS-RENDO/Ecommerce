import React from 'react'
import Image from 'next/image'

export interface PaymentProps {
  name: string;
  quantity: number;
  price: number;
  image?: string; // Made optional to match what you're passing from the page
  color?: string; // Optional color property
}

interface PaymentCardProps {
  items?: PaymentProps[];
}

const PaymentCard: React.FC<PaymentCardProps> = ({ items }) => {
  return (
    <>
      {items?.map((item, index) => (
        <div key={index} className='flex relative mb-4'>
          <div className='w-[232px] h-[168px] border flex items-center justify-center bg-gray-100 overflow-hidden'>
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.name} 
                width={400} 
                height={400}
                className="object-cover w-full h-40"
              />
            ) : (
              <div className="text-gray-500">No Image</div>
            )}
          </div>
          <div className='px-3'>
            <h2 className="font-semibold">{item.name}</h2>
            {item.color && (
            <p>Color: <span className='w-[15px] h-[15px] inline-block rounded-full border align-middle mb-1' style={{backgroundColor: item.color}}></span>x</p>
            )}

            <p className="font-medium">${item.price}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <Image 
            src="/assets/trash.png" 
            alt='trash' 
            width={25} 
            height={28} 
            className='w-[25px] h-[28px] absolute bottom-0 right-0 cursor-pointer hover:opacity-70'
          />
        </div>
      ))}
    </>
  )
}

export default PaymentCard