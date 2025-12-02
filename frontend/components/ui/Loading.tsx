"use client";
import React from "react";

const CartLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-50">
      <div className="animate-pulse flex flex-col items-center">
        <svg
          className="w-16 h-16 text-black mb-4 animate-spin"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6h12.4L17 13M7 13H5.4M17 13l1.2 6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-700">Loading ...</p>
      </div>
    </div>
  );
};

export default CartLoader;
