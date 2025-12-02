import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/app/api/WishlistService";
import { triggerWishlistRefresh } from "@/utils/events";
import { Wishlist } from "@/types/wishlist";
import { Product } from "@/types/product";
import AddToCartButton from "./ui/CartButton";

type ProductComponentProps = {
  product: Product;
};

export const ProductComponent = ({ product }: ProductComponentProps) => {
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);

  useEffect(() => {
    fetchWishlist()
      .then((data) => setWishlist(data))
      .catch((err) => console.error("Failed to fetch Wishlist ", err));
  }, []);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.products.some((p) => p._id === product._id);

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
      // Refresh wishlist after update
      const updated = await fetchWishlist();
      setWishlist(updated);
      triggerWishlistRefresh();
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-w-[150px] h-[240px] rounded-[10px] bg-white shadow flex justify-center items-center group">
      {/* Clickable area for navigation */}
      <Link href={`/category/${product.category?.slug}/${product._id}`} className="absolute inset-0 z-0">
        <div className="w-full h-full"></div>
      </Link>

      <Link
        href={`/category/${product.category?.slug}/${product._id}`}
        className="absolute top-[20px] w-[120px] h-[80px] bg-white flex justify-center items-center z-10"
      >
        <Image
          className="object-cover w-auto h-30 group-hover:scale-105 transition-transform duration-300"
          src={product.images[0].url}
          alt={product.name}
          width={400}
          height={400}
        />
      </Link>

      <div className="absolute mt-10 text-sm z-10">{product.name}</div>
      <div className="absolute mt-20 text-sm z-10">${product.price}</div>

      {/* Buy button */}
      <AddToCartButton 
        productId={product._id} 
        className="absolute w-20 h-10 bg-white bottom-0 left-2 mb-3 flex justify-center items-center border-2 z-20 cursor-pointer"
      >
        Buy
      </AddToCartButton>

      {/* Wishlist button */}
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`absolute w-10 h-10 bottom-0 right-2 mb-3 flex justify-center items-center border-2 z-20 cursor-pointer ${
          isInWishlist ? "bg-red-400 text-white" : "bg-white"
        }`}
      >
        {isInWishlist ? "♥" : "+"}
      </button>
    </div>
  );
};