// components/ui/BestSellerCard.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  rating: number
  soldCount: number
  category: string
  description: string
  imageUrl: string
  isBestSeller: boolean
  rank?: number
}

interface BestSellerCardProps {
  product: Product
}

const BestSellerCard: React.FC<BestSellerCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAddingToCart(true)
    
    // Simulate add to cart action
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('Added to cart:', product.id)
    
    setIsAddingToCart(false)
  }

  return (
    <div className="group relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-200 hover:border-yellow-400 rounded-2xl overflow-hidden bg-white">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-yellow-50 overflow-hidden">
        {!imageError ? (
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Product Image</p>
            </div>
          </div>
        )}

        {/* Best Seller Badge */}
        {product.isBestSeller && (
          <div className="absolute left-3 top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg">
            <Image src="/Icon/champion.png" alt="best seller" width={16} height={16} />
            <span className="text-white text-xs font-bold tracking-wide">Best Seller</span>
          </div>
        )}

        {/* Rank Badge */}
        {product.rank && product.rank <= 3 && (
          <div className="absolute right-3 top-4 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg font-bold text-white text-lg">
            #{product.rank}
          </div>
        )}

        {/* Add to Cart Button - Slides up on hover */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full group-hover:translate-y-[-12px] transition-all duration-300 w-[85%] h-11 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-semibold flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </span>
          )}
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Product Name & Rating */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 flex-1 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-50 px-2 py-1 rounded-lg">
            <Image src="/Icon/star.png" alt="rating" width={14} height={14} />
            <span className="text-sm font-bold text-gray-900">{product.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="pt-1">
          <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-orange-600 font-semibold text-sm">
              {product.soldCount.toLocaleString()}+ sold
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BestSellerCard