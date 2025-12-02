import { useState } from "react";
import { Sparkles, Copy, Check, ShoppingCart } from "lucide-react";

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("SAVE20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16 gap-8">
            {/* Left Content */}
            <div className="flex-1 space-y-6 max-w-xl">
              {/* Limited Offer Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2 rounded-full shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm tracking-wide">LIMITED OFFER</span>
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  20% Off All Products
                </span>
                <br />
                <span className="text-gray-800">Today Only</span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg">
                Upgrade your everyday essentials. Use code{" "}
                <button
                  onClick={handleCopyCode}
                  className="group relative inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span>SAVE20</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {copied ? "Copied!" : "Click to copy"}
                  </span>
                </button>
                {" "}at checkout.
              </p>

              {/* Countdown Timer (Optional) */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Offer ends in:</span>
                </div>
                <div className="flex gap-2">
                  {["12", "34", "56"].map((time, idx) => (
                    <div key={idx} className="bg-gray-900 text-white px-3 py-1 rounded font-mono font-bold">
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <span className="relative flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    SHOP NOW
                  </span>
                </button>

                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95">
                  Get Coupon
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex-shrink-0 w-full lg:w-[500px]">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />
                
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                    alt="Shopping products"
                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 mix-blend-multiply" />
                  
                  {/* Floating Elements */}
                  <div className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg animate-float">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white rounded-full px-4 py-2 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                    <span className="text-sm font-bold text-gray-900">-20%</span>
                  </div>
                </div>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 grid grid-cols-4 gap-2 opacity-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-purple-600 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}