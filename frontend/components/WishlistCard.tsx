import React from "react";
import Image from "next/image";
import Quantitybox from "@/components/Quantitybox"
import AddToCartButton from "./ui/CartButton";

import { useState } from "react";

type WishlistProp = {
  id: string;
  image: string;
  Name: string;
  price: number;
  onRemove: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const WishlistCard = ({id, image, Name, price, onRemove, isSelected= false, onToggleSelect}: WishlistProp) => {
    const [quantity, setQuantity] = useState(1);

    const handleRemove = () => {
    onRemove(id);
    };

    const handleToggleSelect = () => {
      if (onToggleSelect) {
        onToggleSelect(id);
      }
    }

  return (
    <>
      <div className="flex items-center justify-center gap-4 p-3">
        <Image src="/assets/trash.png" alt="trash" width={35} height={35} onClick={handleRemove} className="cursor-pointer"></Image>
        {onToggleSelect && (
        <input type="checkbox" className="scale-250" checked={isSelected} onChange={handleToggleSelect}></input>
        )}
        <div className="relative flex w-[1254px] h-[270px] justify-center items-center gap-30 border shadow mr-20">
          <div className="w-[202px] h-[270px] rounded-[20px] flex justify-center items-center absolute left-0 border">
            <Image src={`${image}`} alt="car" width={1000} height={1000} className="object-cover"></Image>
          </div>
          <p className="absolute left-[320px] text-[24px] font-light tracking-[0.09em]">{Name}</p>
          <p className="absolute font-light text-[48px]">{price}$</p>
          <div className="absolute right-[320px]"> 
            <div>
              <Quantitybox initialQuantity={1} onChange={setQuantity}/>
            </div>
          </div>
          <AddToCartButton 
            className="bg-[#3C215F] w-[268px] h-[66.34px] text-white rounded-[20px] absolute right-0" 
            productId={id}
            quantity={quantity}
          >
            Add to Cart
          </AddToCartButton>
        </div>  

      </div>
    </>
  );
}

export default WishlistCard;