"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

import { useProducts } from '@/hooks/useProduct';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '@/app/api/WishlistService';
import { triggerWishlistRefresh } from '@/utils/events';
import { Wishlist } from '@/types/wishlist';
import AddToCartButton from '@/components/ui/CartButton';
import CartLoader from '@/components/ui/Loading';

const ProfessionalShop = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState<{[key: string]: boolean}>({});

  const { products, loading: productsLoading, error: productsError } = useProducts();

  const itemsPerPage = 9;

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist()
      .then((data) => setWishlist(data))
      .catch((err) => console.error("Failed to fetch Wishlist ", err));
  }, []);

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist?.products?.some((p) => p._id === productId) || false;
  };

  const toggleWishlist = async (productId: string) => {
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      const isCurrentlyInWishlist = isInWishlist(productId);
      
      if (isCurrentlyInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
      
      // Refresh wishlist after update
      const updated = await fetchWishlist();
      setWishlist(updated);
      triggerWishlistRefresh();

    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function getFinalPrice(price: number, discount: number) {
    if (!discount || discount === 0) return price;
    return price - (price * discount) / 100;
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div><CartLoader/></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {productsError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shop</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50">
                <Filter size={16} />
                <span className="text-sm hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group border border-gray-100"
            >
              <div className="relative aspect-square">
                <img
                  src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product._id)}
                  disabled={wishlistLoading[product._id]}
                  className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
                    isInWishlist(product._id)
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart 
                    size={14} 
                    className={`transition-all duration-200 ${
                      isInWishlist(product._id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
                {product.discount !== undefined && product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <div className="p-2 sm:p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium truncate max-w-[70%]">
                    {product.category?.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-gray-500 text-xs">{product.rating}</span>
                  </div>
                </div>

                <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-2 line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    {product.discount  ? (
                      <>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          ${getFinalPrice(product.price, product.discount).toFixed(2)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
      
                <AddToCartButton 
                  productId={product._id} 
                  className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2"
                >
                  <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </AddToCartButton>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalShop;