// components/main/AutoRotatingCategorySection.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { fetchProductsByCategory } from "@/app/api/ProductService";
import ProductCard from "@/components/ProductCard";

const MAX_VISIBLE_CATEGORIES = 10;
const ROTATION_INTERVAL = 10000; // 10 seconds

interface AutoRotatingCategorySectionProps {
  categories: Category[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AutoRotatingCategorySection({
  categories,
}: AutoRotatingCategorySectionProps) {
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize visible categories
  useEffect(() => {
    if (categories.length === 0) return;

    const shuffled = shuffleArray(categories);
    const initial = shuffled.slice(0, MAX_VISIBLE_CATEGORIES);
    setVisibleCategories(initial);
    if (initial.length > 0) {
      setSelectedCategory(initial[0]._id);
    }
  }, [categories]);

  // Auto-rotate categories
  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        const shuffled = shuffleArray(categories);
        const newCategories = shuffled.slice(0, MAX_VISIBLE_CATEGORIES);
        setVisibleCategories(newCategories);
        setSelectedCategory(newCategories[0]?._id || "");
        setFadeOut(false);
      }, 500);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [categories]);

  // Fetch products when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const loadProducts = async () => {
      setLoading(true);
      try {
        // Find the category slug from the selected category ID
        const category = visibleCategories.find((cat) => cat._id === selectedCategory);
        if (!category) {
          console.error('❌ Category not found for ID:', selectedCategory);
          setProducts([]);
          return;
        }

        console.log('🔍 Fetching products for category:', {
          name: category.name,
          slug: category.slug,
          id: category._id
        });

        const data = await fetchProductsByCategory(category.slug, 10);
        
        console.log('✅ Products fetched successfully:', {
          category: category.name,
          count: data.length,
          products: data.map(p => ({
            id: p._id,
            name: p.name,
            categoryId: typeof p.category === 'object' ? p.category._id : p.category,
            categoryName: typeof p.category === 'object' ? p.category.name : 'N/A'
          }))
        });

        if (data.length === 0) {
          console.warn('⚠️ No products found for category:', category.slug);
          console.warn('💡 Check if products in database have this category assigned');
        }

        setProducts(shuffleArray(data));
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, visibleCategories]);

  const handleViewAll = (): void => {
    const category = visibleCategories.find((cat) => cat._id === selectedCategory);
    if (category) {
      window.location.href = `/category/${category.slug}`;
    }
  };

  const selectedCategoryName = visibleCategories.find(
    (cat) => cat._id === selectedCategory
  )?.name;

  return (
    <div className="w-full p-4 mt-8 px-60">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div
            className={`flex items-center justify-center gap-3 flex-wrap transition-opacity duration-500 ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
          >
            {visibleCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat._id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Categories auto-refresh every {ROTATION_INTERVAL / 1000}s
          </div>
        </div>

        {selectedCategoryName && (
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategoryName}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {products.length} products available
              </p>
            </div>
            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        <div key={selectedCategory} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-4 animate-fadeIn">
            {loading ? (
              <div className="w-full text-center py-16 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Loading products...
              </div>
            ) : products.length > 0 ? (
              products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))
            ) : (
              <div className="w-full text-center py-16">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No products found in this category</p>
              
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}