"use client";
import React, { useState } from "react";
import Image from "next/image";
interface CardProps {
  name: string;
  price: number;
  image: string;
}

const CardComponent: React.FC<CardProps> = ({ name, price, image }) => {
  const [value, setValue] = useState(1);
  const decrease = () => setValue((prev) => Math.max(prev - 1, 1));
  const increase = () => setValue((prev) => prev + 1);

  return (
    <div className="w-[901px] h-[130px] ml-15 flex justify-between relative p-5 border border-black mt-10">
      <Image src={image} alt={name} width={80} height={80} className="w-[80px] h-[80px] absolute object-cover" />
      <p className="absolute left-30 text-[20px]">{name}</p>
      <p className="absolute right-5 text-[18px]">${price.toFixed(2)}</p>
      <p className="absolute left-30 top-19 text-[18px] text-[#5136FF]">${(price * value).toFixed(2)}</p>
      <div className="absolute right-30 top-1/2">
        <div className="flex gap-2">
          <button
            onClick={decrease}
            className="w-[32px] h-[32px] bg-[#636363] flex justify-center items-center"
          >
            -
          </button>
          <div className="w-[64px] h-[40px] bg-[#636363] flex justify-center items-center -translate-y-1">
            {value}
          </div>
          <button
            onClick={increase}
            className="w-[32px] h-[32px] bg-[#636363] flex justify-center items-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;