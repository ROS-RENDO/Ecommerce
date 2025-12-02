"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, Award, Globe, Zap, Heart, Star, TrendingUp } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics?: string;
  color: string;
}

// Custom hook for counting animation
const useCountUp = (end: number, duration: number = 2000, suffix: string = '') => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
      const easedProgress = easeOutQuart(progress);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isActive, end, duration]);

  const formattedCount = () => {
    if (suffix === 'M') return (count / 1000000).toFixed(1) + 'M+';
    if (suffix === 'K') return (count / 1000).toFixed(0) + 'K+';
    if (suffix === '%') return (count / 10).toFixed(1) + '%';
    return count + '+';
  };

  return { count: formattedCount(), startCounting: () => setIsActive(true) };
};

const AboutPage: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Count up hooks for each stat
  const { count: customerCount, startCounting: startCustomers } = useCountUp(10000000, 2000, 'M');
  const { count: productCount, startCounting: startProducts } = useCountUp(50000, 2000, 'K');
  const { count: countryCount, startCounting: startCountries } = useCountUp(25, 1500);
  const { count: uptimeCount, startCounting: startUptime } = useCountUp(999, 2000, '%');

  const timelineData: TimelineItem[] = [
    {
      year: "2018",
      title: "The Beginning",
      description: "Started as a small online boutique with a vision to make quality products accessible to everyone. Operating from a garage with just 3 team members.",
      icon: <Heart className="w-6 h-6" />,
      metrics: "3 Team Members",
      color: "from-pink-500 to-rose-500"
    },
    {
      year: "2019", 
      title: "First Milestone",
      description: "Reached our first 1,000 customers and expanded our product catalog to over 500 items. Moved to our first official warehouse.",
      icon: <Users className="w-6 h-6" />,
      metrics: "1K+ Customers",
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched our mobile app and implemented AI-powered recommendations. Despite global challenges, we grew 300% during the pandemic.",
      icon: <Zap className="w-6 h-6" />,
      metrics: "300% Growth",
      color: "from-purple-500 to-indigo-500"
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded internationally to 15 countries and established partnerships with over 200 brands worldwide.",
      icon: <Globe className="w-6 h-6" />,
      metrics: "15 Countries",
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2022",
      title: "Innovation Award",
      description: "Won 'Best E-commerce Innovation' award for our sustainable packaging initiative and carbon-neutral shipping program.",
      icon: <Award className="w-6 h-6" />,
      metrics: "Industry Leader",
      color: "from-yellow-500 to-orange-500"
    },
    {
      year: "2023",
      title: "Community Focus",
      description: "Launched our customer community platform and achieved 4.9-star average rating across all platforms.",
      icon: <Star className="w-6 h-6" />,
      metrics: "4.9★ Rating",
      color: "from-teal-500 to-cyan-500"
    },
    {
      year: "2024",
      title: "Sustainable Future",
      description: "Reached carbon neutrality and launched our marketplace for small businesses, supporting over 1,000 independent sellers.",
      icon: <TrendingUp className="w-6 h-6" />,
      metrics: "1K+ Sellers",
      color: "from-emerald-500 to-green-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Observer for stats section to trigger counting animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCustomers();
          startProducts();
          startCountries();
          startUptime();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section - Adjusted for layout */}
      <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-pulse"
              style={{
                width: Math.random() * 150 + 30,
                height: Math.random() * 150 + 30,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: Math.random() * 3 + 2 + 's'
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Our Story
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
            From a small garage startup to a global ecommerce leader, 
            discover the journey that shaped who we are today.
          </p>
          <button
            onClick={scrollToTimeline}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-base font-medium hover:bg-white/20 transition-all duration-300 group"
          >
            Explore Our Journey
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Timeline</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Every milestone tells a story of growth, innovation, and our commitment to excellence.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-blue-200"></div>

            {timelineData.map((item, index) => (
              <div
                key={index}
                ref={el => { itemRefs.current[index] = el; }}
                data-index={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-xl transition-all duration-700 ${
                    visibleItems.has(index) ? 'scale-110 shadow-2xl' : 'scale-75'
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-6' : 'pl-6'}`}>
                  <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-700 hover:shadow-xl hover:-translate-y-1 ${
                    visibleItems.has(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${item.color} mb-3`}>
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-3 text-sm">{item.description}</p>
                    {item.metrics && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${item.color} bg-opacity-10 border border-opacity-20`}>
                        <span className="text-xs font-semibold text-gray-700">{item.metrics}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty space for opposite side */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">{customerCount}</div>
              <div className="text-sm md:text-base opacity-90">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">{productCount}</div>
              <div className="text-sm md:text-base opacity-90">Products</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">{countryCount}</div>
              <div className="text-sm md:text-base opacity-90">Countries</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">{uptimeCount}</div>
              <div className="text-sm md:text-base opacity-90">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
            To democratize commerce by connecting people with products they love, 
            while building a sustainable future for generations to come.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Quality First", desc: "Every product meets our rigorous standards", icon: <Award className="w-6 h-6" /> },
              { title: "Customer Obsessed", desc: "Your satisfaction drives everything we do", icon: <Heart className="w-6 h-6" /> },
              { title: "Sustainable Future", desc: "Building commerce that protects our planet", icon: <Globe className="w-6 h-6" /> }
            ].map((value, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-indigo-600 mb-3 flex justify-center">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;