import React from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';
import AddToCartButton from './ui/CartButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Calculate discounted price if discount exists
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  // Get the product URL/slug
  const productUrl = `category/${product.category?.slug}/${product._id}`; // or use product.slug if you have it

  return (
    <Link href={productUrl}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 w-64 cursor-pointer">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]?.url || '/assets/default.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          {product.status === 'Out_of_stock' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs text-gray-500 uppercase">
            {typeof product.category === 'object' && product.category?.name
              ? product.category.name
              : 'General'}
          </span>
          <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {product.rating && product.numReviews && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.numReviews})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.discount ? (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <AddToCartButton productId={product._id} className='bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer' children="Add to Cart" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;