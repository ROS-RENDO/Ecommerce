"use client"
import Link from "next/link";
import React, { useState } from "react";



interface ProductDetailProps{
  description: string;
  price: number;
  colors: string[];

  category:string;
  slug:string;
}
const ProductDetail: React.FC<ProductDetailProps> = ({description,price, colors, category, slug}) => {
  const [selectedColor, setSelectedColor] = useState<string>("amber-300");

  return (
    <div className="w-[931px] h-[246px] border border-black rounded-2xl">
      <Link href={`/category/${category}/${slug}`} 
        >
        <div className="ml-5 mt-5 ">
          {description}
        </div>
      </Link>

      <div className="flex mt-2 ml-5 gap-5 w-[238px] items-center justify-between ">
        <div className="underline whitespace-nowrap ">Price: {price}$</div>
        <Link href={"/cart"} className="border border-black w-[121px] h-[28px] flex justify-center items-center rounded-[20px] text-[12px] bg-[#3E0C7F] text-white text-nowrap">
          Add to Cart
        </Link>
      </div>
      <div className="flex mt-3 px-2 gap-2">
        <Link href={`/category/${category}/${slug}`} className="border flex justify-center items-center border-black w-[121px] h-[28px] rounded-[20px] text-[12px]">
          More Options
        </Link>
        <Link href={"/cart"}  className="border flex justify-center items-center border-black w-[121px] h-[28px] text-center rounded-[20px] text-[12px]">
          Buy Now
        </Link>
      </div>
      {colors.length> 0 &&(
        <h2 className="px-5 mt-2 flex ">Color</h2>
      )}
      <div className="flex px-5 gap-2 mt-2">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            className="relative w-[23px] h-[23px] rounded-full cursor-pointer flex items-center justify-center"
          >
            {/* Sliding border effect */}
            <div
              className={`absolute inset-0 rounded-full transition-transform duration-150 ease-in-out
                ${selectedColor === color ? "border-2 border-black scale-100" : "scale-0 border-2 border-transparent"}
              `}
            ></div>

            {/* Stable background circle */}
            <div
              className={`w-[17px] h-[17px] rounded-full z-10 ${
                color
              }`}
            ></div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductDetail;
