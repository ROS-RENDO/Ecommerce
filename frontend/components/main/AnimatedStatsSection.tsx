import React, { useState, useEffect, useRef } from 'react';

const AnimatedStatsBar: React.FC = () => {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [countryCount, setCountryCount] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = (): void => {
    animateValue(setCustomerCount, 0, 50000, 2000);
    animateValue(setProductCount, 0, 100, 2000);
    animateValue(setCountryCount, 0, 25, 2000);
    animateValue(setRatingCount, 0, 4.9, 2000, true);
  };

  const animateValue = (
    setter: React.Dispatch<React.SetStateAction<number>>, 
    start: number, 
    end: number, 
    duration: number, 
    isDecimal: boolean = false
  ): void => {
    const startTime = performance.now();
    const range = end - start;

    const updateValue = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = start + range * easeOutQuart;
      
      if (isDecimal) {
        setter(parseFloat(currentValue.toFixed(1)));
      } else {
        setter(Math.floor(currentValue));
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div 
      ref={statsRef}
      className="w-full py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div className="group">
            <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              {formatNumber(customerCount)}
            </div>
            <div className="text-sm md:text-base opacity-90">Happy Customers</div>
          </div>
          <div className="group">
            <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              {productCount}+
            </div>
            <div className="text-sm md:text-base opacity-90">Products</div>
          </div>
          <div className="group">
            <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              {countryCount}+
            </div>
            <div className="text-sm md:text-base opacity-90">Countries</div>
          </div>
          <div className="group">
            <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              {ratingCount.toFixed(1)}
              <span className="text-yellow-300 ml-1">★</span>
            </div>
            <div className="text-sm md:text-base opacity-90">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsBar;