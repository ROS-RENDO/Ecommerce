"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchFeaturedProducts } from '@/app/api/ProductService';
import { Product } from '@/types/product';

// Sub-components
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const displayPrice = product.discount ? discountedPrice : product.price;
  const originalPrice = product.discount ? product.price : null;

  return (
    <Link href={`category/${product.category?.slug}/${product._id}`}>
      <div className="flex-shrink-0 w-[420px] h-[240px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-gray-100 cursor-pointer">
        <div className="flex h-full">
          {/* Content Section - LEFT SIDE */}
          <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight line-clamp-2">
                {product.name}
              </h3>
              
              {/* Price Section */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${displayPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.rating && product.numReviews ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-base ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.numReviews})
                  </span>
                </div>
              ) : (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-base text-gray-300">★</span>
                  ))}
                </div>
              )}
            </div>

            {/* Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
              className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 active:scale-95 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product.status === 'Out_of_stock'}
            >
              {product.status === 'Out_of_stock' ? 'Out of Stock' : 'Shop Now'}
            </button>
          </div>

          {/* Image Section - RIGHT SIDE */}
          <div className="w-[200px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br opacity-50"></div>
            {product.images && product.images.length > 0 ? (
              <Image 
                src={product.images[0].url} 
                alt={product.name}
                width={200}
                height={200}
                className="relative z-10 w-full h-full object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 drop-shadow-2xl"
              />
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
   
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading Skeleton
const ProductCardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-[420px] h-[240px] bg-gray-100 rounded-2xl animate-pulse">
    <div className="flex h-full">
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
      <div className="w-[200px] bg-gray-200"></div>
    </div>
  </div>
);

// Main Component
const RecommendCarousel: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        console.log('🎯 Fetching recommended products...');
        const data = await fetchFeaturedProducts(6); // Fetch 6 products
        console.log('✅ Recommended products loaded:', data.length);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading recommended products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const scrollLeft = (): void => {
    if (containerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 440);
      setScrollPosition(newPosition);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (): void => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 440);
      setScrollPosition(newPosition);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full py-16 bg-white">
      <div className="relative px-20">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-gray-400 text-base mb-2 tracking-wide">Recommended</p>
            <h2 className="text-5xl font-bold text-gray-900">You May Also Like</h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={scrollLeft}
              disabled={loading || products.length === 0}
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={scrollRight}
              disabled={loading || products.length === 0}
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Left Fade Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          
          {/* Right Fade Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrollable Container */}
          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 pb-4"
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {loading ? (
              // Show loading skeletons
              [...Array(3)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : error ? (
              // Show error message
              <div className="w-full text-center py-16 text-gray-500">
                <p className="text-red-600 mb-2">Failed to load products</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : products.length > 0 ? (
              // Show products
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Show no products message
              <div className="w-full text-center py-16 text-gray-500">
                <p>No recommended products available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecommendCarousel;