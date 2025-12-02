import React from 'react';
import { Zap, Star, TrendingUp, ShoppingCart } from 'lucide-react';

export default function ModernCollectionHero() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 right-1/4 w-20 h-20 border-4 border-purple-300/50 rounded-lg rotate-12 animate-spin" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Section */}
          <div className="space-y-8 z-10">
            {/* Launch Tag */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl">
              <Zap className="w-5 h-5 fill-current animate-pulse" />
              <span className="font-bold text-sm tracking-wider">EXCLUSIVE LAUNCH</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-7xl lg:text-8xl font-black mb-4 leading-none">
                <span className="block text-gray-900">Urban</span>
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Revolution
                </span>
              </h1>
              <div className="flex items-center gap-3 text-2xl font-bold text-gray-700">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span>Fall Collection 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Where street style meets sophistication. Bold designs crafted for the modern trendsetter who refuses to blend in.
            </p>

            {/* Stats Bar */}
            <div className="flex gap-6 py-4">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  200+
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Styles
                </div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  48h
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Delivery
                </div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  40%
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Off Launch
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button className="px-10 py-5 border-3 border-gray-900 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Preview
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main Product Card - Diagonal */}
            <div className="absolute top-0 left-0 right-16 h-[400px] transform rotate-2 hover:rotate-0 transition-transform duration-500 group">
              <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"
                  alt="Featured Product"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Floating Price Tag */}
                <div className="absolute top-6 right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl px-6 py-3 shadow-xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase">Sale</div>
                    <div className="text-2xl font-black">$79</div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-2">(2.4k reviews)</span>
                  </div>
                  <h3 className="text-3xl font-black mb-2">Urban Bomber Jacket</h3>
                  <p className="text-sm text-gray-300 mb-4">Premium leather with signature embroidery</p>
                  <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition">
                    Add to Cart
                  </button>
                </div>

                {/* Trending Badge */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                  🔥 Trending
                </div>
              </div>
            </div>

            {/* Secondary Product 1 */}
            <div className="absolute bottom-0 left-0 w-48 h-56 transform -rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                  alt="Product 2"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-bold mb-1">Street Sneakers</p>
                  <p className="text-lg font-black">$129</p>
                </div>
              </div>
            </div>

            {/* Secondary Product 2 */}
            <div className="absolute bottom-20 right-0 w-52 h-64 transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-xl group-hover:shadow-pink-500/30 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"
                  alt="Product 3"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-bold mb-1">Canvas Tote</p>
                  <p className="text-lg font-black">$45</p>
                </div>
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  New
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white rounded-2xl px-6 py-5 shadow-2xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  15k+
                </div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Happy Customers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent" />
    </div>
  );
}