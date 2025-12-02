"use client";
import { useState, useEffect } from "react";
import { Star, Minus, Plus, Check, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

// Types
interface ProductImage {
  public_id: string;
  url: string;
}

interface ProductVariant {
  sku?: string;
  color?: string;
  size?: string;
  material?: string;
  stock?: number;
  price?: number;
  images?: ProductImage[];
}

interface ProductReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  discount?: number;
  category?: Category;
  brand?: string;
  colors?: string[];
  stock: number;
  variants?: ProductVariant[];
  images: ProductImage[];
  reviews?: ProductReview[];
  numReviews?: number;
  rating?: number;
  tags?: string[];
  status?: "Out_of_stock" | "Low_of_stock" | "Active";
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const benefits = [
  { title: "Free Shipping", subtitle: "On orders over $100" },
  { title: "30-Day Return", subtitle: "Money back guarantee" },
  { title: "2-Year Warranty", subtitle: "Full manufacturer coverage" },
  { title: "Secure Payment", subtitle: "SSL encrypted checkout" }
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [tab, setTab] = useState<"overview" | "specs" | "review" | "shipping">("overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug);
    }
  }, [params.slug]);

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/product/${slug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (!product) return 0;
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  // Get available sizes from variants
  const getAvailableSizes = (): string[] => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.size).filter((s): s is string => Boolean(s)))];
  };

  // Get available colors
  const getAvailableColors = (): string[] => {
    if (product?.colors && product.colors.length > 0) return product.colors;
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.color).filter((c): c is string => Boolean(c)))];
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!product?.reviews || product.reviews.length === 0) {
      return [
        { label: "5 stars", pct: 0 },
        { label: "4 stars", pct: 0 },
        { label: "3 stars", pct: 0 },
        { label: "2 stars", pct: 0 },
        { label: "1 star", pct: 0 }
      ];
    }

    const total = product.reviews.length;
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = product.reviews!.filter(r => Math.floor(r.rating) === star).length;
      return {
        label: `${star} star${star > 1 ? 's' : ''}`,
        pct: Math.round((count / total) * 100)
      };
    });

    return distribution;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || 'Unable to load product'}</p>
        </div>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice();
  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb/>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 mt-10">
        {/* Left Side - Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={product.images[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              width={400}
              height={400}
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={img.public_id}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === idx ? "border-amber-500" : "border-transparent"
                  }`}
                >
                  <Image width={400} height={400} src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4 p-6 border border-gray-200 rounded-2xl">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{benefit.title}</h3>
                  <p className="text-xs text-gray-600">{benefit.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6">
          {/* Category & Rating */}
          <div className="flex items-center gap-4 flex-wrap">
            {product.category && (
              <span className="px-4 py-1 bg-gray-100 rounded-full text-sm">{product.category.name}</span>
            )}
            {product.brand && (
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{product.brand}</span>
            )}
            {product.rating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.numReviews || 0} reviews)</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-4xl font-bold">{product.name}</h1>

          {/* Description */}
          <p className="text-gray-700">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-semibold">${discountedPrice.toFixed(2)}</span>
            {product.discount && (
              <>
                <span className="text-2xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.status === "Out_of_stock" && (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
            {product.status === "Low_of_stock" && (
              <span className="text-orange-600 font-semibold">Low Stock - Only {product.stock} left!</span>
            )}
            {product.status === "Active" && (
              <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
            )}
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 h-12 rounded-lg border-2 transition ${
                      selectedSize === size
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 h-12 rounded-lg border-2 transition ${
                      selectedColor === color
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-3 hover:bg-gray-100 transition"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-3 hover:bg-gray-100 transition"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">Max: {product.stock}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={product.status === "Out_of_stock"}
            >
              Add to Cart
            </button>
            <button 
              className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={product.status === "Out_of_stock"}
            >
              Buy Now
            </button>
          </div>

          {/* Product Meta */}
          <div className="pt-6 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{product.category?.name || 'N/A'}</span>
            </div>
            {product.brand && (
              <div className="flex justify-between">
                <span className="text-gray-600">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.tags && product.tags.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tags</span>
                <span className="font-medium">{product.tags.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b">
          {(["overview", "review", "shipping"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 px-2 font-semibold transition capitalize ${
                tab === t ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
            >
              {t === "review" ? "Reviews" : t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Product Overview</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Available Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.variants.map((variant, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-xl">
                        {variant.color && <p><span className="font-semibold">Color:</span> {variant.color}</p>}
                        {variant.size && <p><span className="font-semibold">Size:</span> {variant.size}</p>}
                        {variant.material && <p><span className="font-semibold">Material:</span> {variant.material}</p>}
                        {variant.price && <p><span className="font-semibold">Price:</span> ${variant.price.toFixed(2)}</p>}
                        {variant.stock !== undefined && <p><span className="font-semibold">Stock:</span> {variant.stock}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "review" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Customer Reviews</h2>

              {/* Rating Summary */}
              <div className="flex gap-12 items-start">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{product.rating?.toFixed(1) || '0.0'}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Based on {product.numReviews || 0} reviews</p>
                </div>

                <div className="flex-1 space-y-2">
                  {ratingDistribution.map(({ label, pct }) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="w-20 text-sm">{label}</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, idx) => {
                    const displayName = review.name || 'Anonymous';
                    const initial = displayName.charAt(0).toUpperCase();
                    
                    return (
                      <div key={review._id || idx} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {initial}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">{displayName}</h4>
                              <div className="text-right">
                                <div className="flex gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${
                                        i < Math.floor(review.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}

          {tab === "shipping" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Shipping Information</h2>
                <p className="text-gray-700 mb-6">
                  We offer multiple shipping options to ensure your order arrives quickly and safely.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { type: "Standard", time: "3-5 Business Days", note: "Free on orders over $100" },
                    { type: "Express", time: "2-3 Business Days", note: "$15.99" },
                    { type: "Overnight", time: "1 Business Day", note: "$29.99" },
                    { type: "International", time: "7-14 Business Days", note: "Varies by location" }
                  ].map((option, idx) => (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl">
                      <h4 className="text-xs text-gray-500 uppercase mb-2">{option.type} Shipping</h4>
                      <p className="font-semibold mb-1">{option.time}</p>
                      <p className="text-sm text-gray-600">{option.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Returns & Refunds</h2>
                <p className="text-gray-700 mb-4">
                  We want you to be completely satisfied with your purchase. If you're not happy
                  with your order, you can return it within 30 days for a full refund.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Free return shipping on defective items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Original packaging not required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Refunds processed within 5-7 business days</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}