// components/ui/NewArrivalCard.tsx
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
  isNew: boolean
}

interface NewArrivalCardProps {
  product: Product
}

const NewArrivalCard: React.FC<NewArrivalCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // Add to cart logic here
    console.log('Added to cart:', product.id)
  }

  return (
    <div className="group relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-200 hover:border-blue-400 rounded-2xl overflow-hidden bg-white">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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

        {/* New Badge */}
        {product.isNew && (
          <div className="absolute left-3 top-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 shadow-lg">
            <Image src="/Icon/stararrival.png" alt="new" width={14} height={14} />
            <span className="text-white text-xs font-semibold">New</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
        >
          <Image src="/Icon/cart.png" alt="cart" width={20} height={20} />
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Just Arrived Badge */}
        <div className="flex items-center gap-2">
          <Image src="/Icon/calendar.png" alt="calendar" width={14} height={14} />
          <span className="text-blue-600 text-sm font-medium">Just arrived!</span>
        </div>

        {/* Product Name & Rating */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 flex-1 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Image src="/Icon/star.png" alt="rating" width={14} height={14} />
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="pt-1">
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-gray-500 text-sm">
            {product.soldCount.toLocaleString()}+ sold
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NewArrivalCard