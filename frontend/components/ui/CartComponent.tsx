"use client";
import React, { useState } from "react";
import Image from "next/image";

interface CardProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onRemoved?: (itemId: string) => void;
  onQuantityChange?: (newQty: number) => void;
}

const CardComponent: React.FC<CardProps> = ({
  _id,
  name,
  price,
  image,
  quantity,
  onRemoved,
  onQuantityChange,
}) => {
  const [value, setValue] = useState(quantity);

  const decrease = () => {
    const newValue = Math.max(value - 1, 1);
    setValue(newValue);
    onQuantityChange?.(newValue);
  };

  const increase = () => {
    const newValue = value + 1;
    setValue(newValue);
    onQuantityChange?.(newValue);
  };

  const handleRemoveClick = () => {
    onRemoved?.(_id);
  };

  return (
    <div className="w-[901px] h-[130px] ml-15 flex justify-between relative p-6 border border-black mt-10">
      <span className="w-[120px] h-[80px] bg-white flex justify-center items-center relative">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className="w-auto h-30 absolute object-cover ml-5"
          />
      </span>
      <span
        className="absolute -translate-4 font-medium text-[20px] border-gray-500 border rounded-full w-7 text-center cursor-pointer"
        onClick={handleRemoveClick}
      >
        X
      </span>

      <p className="absolute left-40 text-[20px]">{name}</p>
      <p className="absolute right-5 text-[18px]">${price.toFixed(2)}</p>
      <p className="absolute left-40 top-19 text-[18px] text-[#5136FF]">
        ${(price * value).toFixed(2)}
      </p>
      <div className="absolute right-30 top-1/2">
        <div className="flex gap-2">
          <button
            onClick={decrease}
            className="w-[32px] h-[32px] bg-[#a3a3a3] flex justify-center items-center cursor-pointer"
          >
            -
          </button>
          <div className="w-[64px] h-[40px] bg-[#ececec] flex justify-center items-center -translate-y-1">
            {value}
          </div>
          <button
            onClick={increase}
            className="w-[32px] h-[32px] bg-[#a3a3a3] flex justify-center items-center cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
