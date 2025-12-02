"use client";
import React, { useState, useEffect } from "react";
import WishlistCard from "@/components/WishlistCard";
import Image from "next/image";
import AuthWrapper from "@/context/AuthContext";

import { WishlistProduct } from "@/types/wishlist";
import { useWishlist } from "@/hooks/useWishlist";
import CartLoader from "@/components/ui/Loading";

// Create the actual wishlist content as a separate component
const WishlistContent = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { wishlist, loading, error, fetchWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (!wishlist) return;
    const allIds = wishlist.products.map((product) => product._id);
    setSelectedItems(
      selectedItems.length === wishlist.products.length ? [] : allIds
    );
  };

  const deleteSelected = async () => {
    if (!wishlist || selectedItems.length === 0) return;
    try {
      for (const id of selectedItems) {
        await removeFromWishlist(id);
      }
      await fetchWishlist();
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to delete selected items:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CartLoader />
      </div>
    );
  }

  // Show empty state
  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-base sm:text-lg">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full py-6 sm:py-10 flex justify-center items-center">
        <div className="w-full max-w-[405px] h-[33px] bg-[#3C215F] rounded-3xl flex items-center justify-center">
          <h1 className="text-sm sm:text-base font-light text-white tracking-[0.20em]">
            FAVORITE
          </h1>
        </div>
      </div>

      {/* Table Header - Hidden on mobile */}
      <div className="hidden md:flex w-full justify-center items-center mb-4">
        <div className="w-full max-w-[1254px] h-[76px] flex gap-8 lg:gap-37 border justify-around items-center border-black text-lg lg:text-[22px] font-normal">
          <p>Product Name</p>
          <p>Price</p>
          <p>Quantity</p>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex w-full py-3 sm:py-5 px-4 sm:px-8 lg:px-49 gap-2 sm:gap-3 items-center flex-wrap">
        <input
          type="checkbox"
          className="scale-125 sm:scale-150 cursor-pointer"
          checked={selectedItems.length === wishlist.products.length && wishlist.products.length > 0}
          onChange={selectAll}
        />
        <div 
          className="relative w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] cursor-pointer" 
          onClick={deleteSelected}
        >
          <Image
            src="/assets/trash.png"
            alt="trash"
            width={35}
            height={35}
            className="object-cover"
          />
          {selectedItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {selectedItems.length}
            </span>
          )}
        </div>
        <p 
          className="text-base sm:text-lg lg:text-[20px] font-normal cursor-pointer" 
          onClick={selectAll}
        >
          Select All
        </p>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-2 sm:space-y-4">
        {wishlist.products.map((item: WishlistProduct, index) => (
          <WishlistCard
            key={item._id || `${item.name}-${index}`}
            id={item._id}
            image={item.images?.[0].url || "/assets/placeholder.png"}
            Name={item.name}
            price={item.price}
            onRemove={handleRemove}
            isSelected={selectedItems.includes(item._id)}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

// Main component - only handles authentication
const WishlistPage = () => {
  return (
    <AuthWrapper fallbackRedirect="/auth/login">
      <WishlistContent />
    </AuthWrapper>
  );
};

export default WishlistPage;