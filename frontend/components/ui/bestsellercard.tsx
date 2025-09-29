import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BestSellerCard = () => {
  return (
    <div className="group relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-yellow-400 border rounded-[15px] overflow-hidden w-[431px]">
      {/* Top Image Section */}
      <div className="w-full h-[256px] bg-[#D9D9D9] relative">
        {/* Best Seller Badge */}
        <div className="w-[112px] h-[28px] rounded-[15px] absolute left-0 top-5 flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 px-5 ml-3">
          <Image src="/Icon/champion.png" alt="champion" width={16} height={16} />
          <p className="text-white whitespace-nowrap ml-1">Best Seller</p>
        </div>

        {/* Add to Cart Button */}
        <Link
          href="/cart"
          className="absolute left-1/2 transform -translate-x-1/2 bottom-[-50px] group-hover:bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out w-[361px] h-[40px] rounded-[10px] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-medium flex items-center justify-center"
        >
          Add to Cart
        </Link>
      </div>

      {/* Bottom Details Section */}
      <div className="w-full h-[168px] bg-white rounded-b-[15px] border-t relative">
        <div className="flex justify-between p-5">
          <p className="font-bold text-[15px]">Premium Wireless Headphones Pro</p>
          <div className="flex gap-2 justify-center items-center">
            <Image src="/Icon/star.png" alt="star" width={15} height={15} />
            <p>4.9</p>
          </div>
        </div>

        <p className="px-5 text-[12px]">Industry-leading noise cancellation, 30-hour battery life</p>

        <p className="font-normal text-[24px] text-[#C8A000] px-5 py-2">$299.99</p>

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

export default BestSellerCard;
