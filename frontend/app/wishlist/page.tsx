"use client";
import React, { useState, useEffect } from "react";
import WishlistCard from "@/components/WishlistCard";
import Image from "next/image";
import AuthWrapper from "@/context/AuthContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  slug?: string;
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlistItems(JSON.parse(stored));
  }, []);

  const updateStorage = (items: Product[]) => {
    localStorage.setItem("wishlist", JSON.stringify(items));
    setWishlistItems(items);
  };

  const handleDelete = (id: number) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    updateStorage(updated);
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const deleteSelected = () => {
    const updated = wishlistItems.filter((item) => !selectedItems.includes(item.id));
    updateStorage(updated);
    setSelectedItems([]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <AuthWrapper>     
        <div className="w-full py-10 flex justify-center items-center relative ">
          <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
            <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
              FAVORITE
            </h1>
          </div>
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="w-[1254px] h-[76px] flex gap-37 border justify-center items-center border-black text-[22px] font-normal">
            <p>Product Name</p>
            <p>Price</p>
            <p>Quantity</p>
          </div>
        </div>

        <div className="flex w-full py-5 px-49 gap-2">
          <input
            type="checkbox"
            className="scale-150"
            checked={selectedItems.length === wishlistItems.length}
            onChange={toggleSelectAll}
            />
          <div className="relative w-[35px] h-[35px] cursor-pointer" onClick={deleteSelected}>
            <Image
              src="/assets/trash.png"
              alt="trash"
              width={35}
              height={35}
              className="object-cover"
              />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {`${selectedItems.length}`}
            </span>
          </div>
          <p className="text-[20px] font-normal">Select All</p>
        </div>

        <div>
          {wishlistItems.map((item) => (
            <WishlistCard
              id={item.id}
              key={item.id}
              image={item.image}
              Name={item.name}
              price={item.price}
              checked={selectedItems.includes(item.id)}
              onCheck={toggleItem}
              onDelete={handleDelete}
              />
          ))}
        </div>
      </AuthWrapper>
    </>
  );
};

export default Wishlist;
