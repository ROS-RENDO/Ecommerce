import React from "react";
import Image from "next/image";
import Link from "next/link";

type Componentprop = {
  image: string;
  name: string;
  price: number;
  category: string;
  slug: string;
  id: number;
};

export const ProductComponent = ({
  image,
  name,
  price,
  category,
  slug,
  id,
}: Componentprop) => {
  return (
    <div className="relative min-w-[150px] h-[240px] rounded-[10px] bg-white shadow flex justify-center items-center">
      {/* Clickable area for navigation */}
      <Link
        href={`/category/${category}/${slug}`}
        className="absolute inset-0 z-0"
      >
        <div className="w-full h-full"></div>
      </Link>

      <Link
        href={`/category/${category}/${slug}`}
        className="absolute top-[20px] w-[120px] h-[80px] bg-white flex justify-center items-center z-10"
      >
        <Image
          className="object-cover"
          src={image}
          alt="laptop"
          width={100}
          height={100}
        />
      </Link>

      <div className="absolute mt-10 text-sm z-10">{name}</div>
      <div className="absolute mt-20 text-sm z-10">${price}</div>

      {/* Buy button */}
      <button
        onClick={() => {
          alert("Buy clicked!");
          window.location.href = "/cart"; // Navigate manually
        }}
        className="absolute w-20 h-10 bg-white bottom-0 left-2 mb-3 flex justify-center items-center border-2 z-20"
      >
        Buy
      </button>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Stop Link navigation
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
          const item = { id, name, price, image, category, slug };
          const exists = wishlist.find((p: Componentprop) => p.id === id);
          if (!exists) {
            wishlist.push(item);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert("Added to wishlist!");
          } else {
            alert("Already in wishlist!");
          }
        }}
        className="absolute w-10 h-10 bg-white bottom-0 right-2 mb-3 flex justify-center items-center border-2 z-20"
      >
        +
      </button>
    </div>
  );
};
