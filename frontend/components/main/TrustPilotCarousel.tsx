import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Designer",
    review: "Absolutely love the quality! The products exceeded my expectations and the delivery was super fast. Will definitely shop again.",
    rating: 5,
    avatar: "bg-purple-500"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    review: "Outstanding customer service and top-notch products. The attention to detail is impressive. Highly recommended!",
    rating: 5,
    avatar: "bg-blue-500"
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Marketing Manager",
    review: "Best purchase I've made this year! The quality is exceptional and it arrived perfectly packaged. Five stars all the way!",
    rating: 5,
    avatar: "bg-pink-500"
  },
  {
    id: 4,
    name: "David Brown",
    role: "Entrepreneur",
    review: "Incredible value for money. The product quality speaks for itself. Customer support was also very helpful and responsive.",
    rating: 5,
    avatar: "bg-green-500"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Graphic Designer",
    review: "So impressed with everything! From ordering to delivery, the whole experience was seamless. Will be a repeat customer for sure.",
    rating: 5,
    avatar: "bg-orange-500"
  },
  {
    id: 6,
    name: "James Miller",
    role: "Business Owner",
    review: "Fantastic experience from start to finish. The quality exceeded my expectations and shipping was lightning fast!",
    rating: 5,
    avatar: "bg-red-500"
  }
];

const TrustPilotCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (dragOffset > 50) {
      // Dragged right - go to previous
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    } else if (dragOffset < -50) {
      // Dragged left - go to next
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
    
    setDragOffset(0);
  };

  const getCardStyle = (offset: number): React.CSSProperties => {
    const dragProgress = isDragging ? dragOffset / 400 : 0;
    const position = offset + dragProgress;
    
    let opacity = 1;
    let scale = 1;
    let zIndex = 10;
    let translateX = position * 450;

    if (position === 0) {
      // Center card
      opacity = 1;
      scale = 1;
      zIndex = 30;
    } else if (position === -1) {
      // Left card
      opacity = 0.6;
      scale = 0.9;
      zIndex = 20;
    } else if (position === 1) {
      // Right card
      opacity = 0.6;
      scale = 0.9;
      zIndex = 20;
    } else {
      // Cards further away
      opacity = 0;
      scale = 0.8;
      zIndex = 10;
    }

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + reviews.length) % reviews.length;
      cards.push({ review: reviews[index], offset: i });
    }
    return cards;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
        <p className="text-gray-600">Trusted by thousands of happy customers</p>
      </div>

      <div
        ref={containerRef}
        className="relative h-[300px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {getVisibleCards().map(({ review, offset }) => (
            <div
              key={review.id}
              className="absolute w-[400px] border-2 border-black rounded-lg p-6 bg-white shadow-lg pointer-events-none"
              style={getCardStyle(offset)}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 min-h-[100px]">
                "{review.review}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${review.avatar} flex items-center justify-center text-white font-bold text-xl`}>
                  {review.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-black w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrustPilotCarousel;