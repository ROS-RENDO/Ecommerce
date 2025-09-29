import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewArrivalCard = () => {
  return (
    <div className="group relative transition-transform hover:scale-105 hover:shadow-lg border hover:border-blue-500 rounded-[15px] overflow-hidden w-[431px]">
      <div className="w-full h-[256px] bg-[#D9D9D9] relative">
        {/* New Arrival Tag */}
        <div className="w-[79px] h-[28px] rounded-[15px] absolute left-0 top-5 flex items-center justify-center px-5 ml-3 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
          <Image src="/Icon/stararrival.png" alt="champion" width={16} height={16} />
          <p className="text-white whitespace-nowrap ml-1">New </p>
        </div>

        {/* Slide-in Cart Icon (hidden until hover) */}
        <Link
          href="/cart"
          className="absolute bottom-[-24px] right-[-60px] group-hover:right-5 transition-all duration-300 ease-in-out w-[48px] h-[48px] rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-md z-10"
        >
          <Image src="/Icon/cart.png" alt="cart" width={24} height={24} />
        </Link>
      </div>

      <div className="w-full h-[168px] bg-white rounded-b-[15px] border-t">
        <div className="flex px-5 items-center gap-2 pt-3">
          <Image src="/Icon/calendar.png" alt="calendar" width={16} height={16} />
          <p className="text-[#2563EB]">Just arrived!</p>
        </div>

        <div className="flex justify-between px-5 py-2">
          <p className="font-bold text-[15px]">Premium Wireless Headphones Pro</p>
          <div className="flex gap-2 justify-center items-center">
            <Image src="/Icon/star.png" alt="star" width={15} height={15} />
            <p>4.9</p>
          </div>
        </div>

        <p className="px-5 text-[12px]">
          Industry-leading noise cancellation, 30-hour battery life
        </p>

        <p className="font-normal text-[24px] px-5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          $299.99
        </p>

        <div className="flex justify-between px-5 pb-3">
          <p>2390+ sold</p>
          <div className="w-[82px] h-[21px] rounded-[15px] flex justify-center items-center border bg-[#D9D9D9] text-[12px]">
            <p>electronics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalCard;
