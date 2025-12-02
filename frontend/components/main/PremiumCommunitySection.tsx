import { Crown, Gift, TrendingUp, Headphones, Users, MessageCircle, Heart, Sparkles } from "lucide-react";

export default function PremiumCommunitySection() {
  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Premium Member Card */}
          <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 lg:p-10 overflow-hidden border-2 border-amber-200 hover:border-amber-300 transition-all duration-500 hover:shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            {/* Crown Icon */}
            <div className="relative mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">PREMIUM</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="relative text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              PREMIUM MEMBER PROMOTION
            </h2>

            {/* Subtitle */}
            <p className="relative text-gray-700 mb-6 text-lg">
              Unlock all the benefits with <span className="font-semibold text-amber-600">ShopHub Plus Premium</span>
            </p>

            {/* Benefits List */}
            <ul className="relative space-y-4 mb-8">
              {[
                { icon: <TrendingUp className="w-5 h-5" />, text: "Better prices on all products" },
                { icon: <Gift className="w-5 h-5" />, text: "Plus Points for items you buy" },
                { icon: <Sparkles className="w-5 h-5" />, text: "Regular bonuses and exclusive rewards" },
                { icon: <Headphones className="w-5 h-5" />, text: "Priority premium support 24/7" }
              ].map((benefit, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover/item:bg-amber-200 group-hover/item:scale-110 transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <span className="text-gray-700 pt-1.5 font-medium">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button className="relative group/button w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
              
              <span className="relative flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                Join Premium Now
              </span>
            </button>

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 bg-white rounded-full px-4 py-2 shadow-lg animate-bounce">
              <span className="text-sm font-bold text-orange-600">Save 50%</span>
            </div>
          </div>

          {/* Community Card */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 lg:p-10 overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            {/* Users Icon */}
            <div className="relative mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">50K+ MEMBERS</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="relative text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join Our Community
            </h2>

            {/* Description */}
            <p className="relative text-gray-700 mb-6 text-lg">
              Connect with thousands of shoppers, share reviews, get exclusive deals, and be part of something special.
            </p>

            {/* Community Features */}
            <div className="relative grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: <MessageCircle className="w-6 h-6" />, label: "Live Chat", color: "purple" },
                { icon: <Heart className="w-6 h-6" />, label: "Exclusive Deals", color: "pink" },
                { icon: <Users className="w-6 h-6" />, label: "Member Events", color: "blue" },
                { icon: <Gift className="w-6 h-6" />, label: "Giveaways", color: "indigo" }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`group/feature bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center text-${feature.color}-600 mb-3 group-hover/feature:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="relative flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                  +50K
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-purple-600">5,234</span> joined this week
              </div>
            </div>

            {/* CTA Button */}
            <button className="relative group/button w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
              
              <span className="relative flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Join Community Free
              </span>
            </button>

            {/* Floating Notification */}
            <div className="absolute bottom-6 right-6 bg-white rounded-lg px-4 py-2 shadow-lg animate-float">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-700">234 online now</span>
              </div>
            </div>
          </div>
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}