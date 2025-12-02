import { useEffect, useState } from 'react';

const PaymentScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
    
  const paymentMethods = [
    { id: 1, name: 'Visa', logo: '💳' },
    { id: 2, name: 'Mastercard', logo: '💳' },
    { id: 3, name: 'PayPal', logo: '💙' },
    { id: 4, name: 'Google Pay', logo: '🌈' },
    { id: 5, name: 'Apple Pay', logo: '🍎' },
    { id: 6, name: 'Stripe', logo: '💜' },
    { id: 7, name: 'Skrill', logo: '💰' },
    { id: 8, name: 'Neteller', logo: '💚' },
    { id: 9, name: 'Venmo', logo: '💵' },
    { id: 10, name: 'Alipay', logo: '🔵' },
    { id: 11, name: 'WeChat Pay', logo: '💬' },
    { id: 12, name: 'Amazon Pay', logo: '📦' },
    { id: 13, name: 'Klarna', logo: '🛍️' },
    { id: 14, name: 'Afterpay', logo: '✨' },
    { id: 15, name: 'Cash App', logo: '💸' },
    { id: 16, name: 'Zelle', logo: '⚡' },
    { id: 17, name: 'Square', logo: '⬛' },
    { id: 18, name: 'Samsung Pay', logo: '📱' },
  ];

  const displayMethods = [...paymentMethods, ...paymentMethods, ...paymentMethods];

  // Auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const cardWidth = 144; // 128px (w-32) + 16px (gap-4)
        const maxScroll = paymentMethods.length * cardWidth;
        
        if (prev >= maxScroll) {
          return 0;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [paymentMethods.length]);

  const PaymentMethod = ({ name, logo }: { name: string; logo: string }) => {
    return (
      <div className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 border border-gray-100">
        <div className="text-center">
          <div className="text-3xl mb-1">{logo}</div>
          <div className="text-xs font-semibold text-gray-700">{name}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Methods</h2>
        <p className="text-gray-600">We accept all major payment providers</p>
      </div>

      <div className="relative overflow-hidden py-8">
        {/* Left fade gradient - white theme */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
        
        {/* Right fade gradient - white theme */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div 
          className="flex gap-4 transition-transform"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            width: 'max-content',
            transitionTimingFunction: 'linear'
          }}
        >
          {displayMethods.map((method, index) => (
            <PaymentMethod
              key={`${method.id}-${index}`}
              name={method.name}
              logo={method.logo}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">Secure & Trusted Payment Processing</p>
      </div>
    </div>
  );
};

export default PaymentScroll;