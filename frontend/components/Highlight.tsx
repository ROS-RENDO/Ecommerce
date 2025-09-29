'use client';
import React from 'react';

const Highlight = () => {
  return (
    <div className="overflow-hidden bg-[#CA3A3A] text-white text-sm py-2">
      <ul
        className="flex whitespace-nowrap [animation:scroll_20s_linear_infinite] hover:[animation-play-state:paused]"
        style={{
          animationName: 'scroll',
        }}
      >
        <li className="mx-8">🔥 50% OFF All Items – Ends Sunday!</li>
        <li className="mx-8">🎁 Buy 1 Get 1 Free on T-Shirts!</li>
        <li className="mx-8">🔴 50% OFF Storewide – Use code JUNE50 – Ends Sunday!</li>
        <li className="mx-8">🚚 Free Shipping over $50!</li>
      </ul>

      {/* Keyframes injected directly into the page */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Highlight;
