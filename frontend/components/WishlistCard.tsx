import React from "react";
import Image from "next/image";
import Quantitybox from "@/components/Quantitybox"
type Wishlistprop={
  id: number;
  key: number;
  image: string;
  Name: string;
  price: number;
  checked: boolean;
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
}
  const WishlistCard = ({id, image, Name, price, checked, onCheck, onDelete}: Wishlistprop) => {

  return (

    <>
      <div className="flex items-center justify-center gap-4 p-3">
        <Image src="/assets/trash.png" alt="trash" width={35} height={35} onClick={()=> onDelete(id)} className="cursor-pointer"></Image>
        <input type="checkbox" className="scale-250" checked={checked}
        onChange={() => onCheck(id)}></input>
        <div className="relative flex w-[1254px] h-[270px] justify-center items-center gap-30 border shadow">
          <div className="w-[202px] h-[270px] rounded-[20px] flex justify-center items-center absolute left-0 border">
            <Image src={`${image}`} alt="car" width={1000} height={1000} className="object-cover"></Image>
          </div>
          <p className="absolute left-[320px] text-[24px] font-light tracking-[0.09em]">{Name}</p>
          <p className="absolute font-light text-[48px]">{price}$</p>
          <div className="absolute right-[320px]"> 
            <div>
              <Quantitybox/>
            </div>
          </div>
          <button className="bg-[#3C215F] w-[268px] h-[66.34px] text-white rounded-[20px] absolute right-0">Add to Cart</button>
        </div>  

      </div>
    </>
  );
}

export default WishlistCard;
