import { useState } from "react";
import { ShoppingBag, TrendingUp, Zap } from "lucide-react";

interface ShowcaseCard {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  icon?: React.ReactNode;
}

const showcaseItems: ShowcaseCard[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    title: "New Collection",
    subtitle: "Explore Latest Trends",
    badge: "HOT",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
    title: "Summer Sale",
    subtitle: "Up to 70% Off",
    badge: "SALE",
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    title: "Premium Quality",
    subtitle: "Curated Selection",
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    title: "Best Sellers",
    subtitle: "Customer Favorites",
    badge: "TOP",
    icon: <TrendingUp className="w-5 h-5" />
  }
];

export default function AnimatedShowcaseGrid() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg">
            Discover our handpicked selection of premium products
          </p>
        </div>

        {/* Grid Layout */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
          {/* Left Large Card */}
          <div
            className="w-full lg:w-[400px] h-[520px] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            onMouseEnter={() => setHoveredId(1)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                hoveredId === 1 ? "scale-110" : "scale-100"
              }`}
            >
              <img
                src={showcaseItems[0].image}
                alt={showcaseItems[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Badge */}
            {showcaseItems[0].badge && (
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                  {showcaseItems[0].badge}
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 z-10 transition-transform duration-500 ${
              hoveredId === 1 ? "translate-y-0" : "translate-y-2"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                  {showcaseItems[0].icon}
                </div>
              </div>
              <h3 className="text-white text-3xl font-bold mb-2">
                {showcaseItems[0].title}
              </h3>
              <p className="text-white/90 text-lg mb-4">
                {showcaseItems[0].subtitle}
              </p>
              <button className={`bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 ${
                hoveredId === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* Middle Column - Two Cards */}
          <div className="flex flex-col gap-6">
            {/* Top Card */}
            <div
              className="w-full lg:w-[400px] h-[300px] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              onMouseEnter={() => setHoveredId(2)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`absolute inset-0 transition-transform duration-700 ease-out ${
                  hoveredId === 2 ? "scale-110 rotate-2" : "scale-100 rotate-0"
                }`}
              >
                <img
                  src={showcaseItems[1].image}
                  alt={showcaseItems[1].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Badge */}
              {showcaseItems[1].badge && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-lg">
                    {showcaseItems[1].badge}
                  </div>
                </div>
              )}

              <div className={`absolute bottom-0 left-0 right-0 p-6 z-10 transition-all duration-500 ${
                hoveredId === 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                    {showcaseItems[1].icon}
                  </div>
                </div>
                <h3 className="text-white text-2xl font-bold mb-1">
                  {showcaseItems[1].title}
                </h3>
                <p className="text-white/90 text-sm">
                  {showcaseItems[1].subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Card */}
            <div
              className="w-full lg:w-[400px] h-[200px] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              onMouseEnter={() => setHoveredId(3)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  hoveredId === 3 ? "scale-110 brightness-110" : "scale-100 brightness-100"
                }`}
              >
                <img
                  src={showcaseItems[2].image}
                  alt={showcaseItems[2].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 mix-blend-multiply" />
              </div>

              <div className={`absolute inset-0 p-6 z-10 flex items-center transition-all duration-500 ${
                hoveredId === 3 ? "translate-x-0" : "translate-x-2"
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                      {showcaseItems[2].icon}
                    </div>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1">
                    {showcaseItems[2].title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {showcaseItems[2].subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Large Card */}
          <div
            className="w-full lg:w-[400px] h-[520px] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            onMouseEnter={() => setHoveredId(4)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                hoveredId === 4 ? "scale-110 rotate-1" : "scale-100 rotate-0"
              }`}
            >
              <img
                src={showcaseItems[3].image}
                alt={showcaseItems[3].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Badge */}
            {showcaseItems[3].badge && (
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {showcaseItems[3].badge}
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 z-10 transition-all duration-500 ${
              hoveredId === 4 ? "translate-y-0" : "translate-y-4"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                  {showcaseItems[3].icon}
                </div>
              </div>
              <h3 className="text-white text-3xl font-bold mb-2">
                {showcaseItems[3].title}
              </h3>
              <p className="text-white/90 text-lg mb-4">
                {showcaseItems[3].subtitle}
              </p>
              <button className={`bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 ${
                hoveredId === 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                Explore Now
              </button>
            </div>

            {/* Decorative Elements */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-opacity duration-700 ${
              hoveredId === 4 ? "opacity-100" : "opacity-0"
            }`} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            View All Collections
          </button>
        </div>
      </div>
    </div>
  );
}