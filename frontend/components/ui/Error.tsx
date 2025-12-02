"use client";
import React from "react";

interface CartErrorProps {
  message: string;
  onRetry?: () => void; // optional retry button
}

const CartError: React.FC<CartErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col justify-center items-center p-10 bg-red-100 border border-red-400 rounded-lg text-center">
      <svg
        className="w-12 h-12 text-red-600 mb-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <p className="text-red-700 font-medium mb-3">{message}</p>
      {onRetry && (
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default CartError;
