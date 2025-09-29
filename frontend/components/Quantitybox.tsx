"use client"
import React, { useState } from "react";

const QuantityBox = () => {
  const [quantity, setQuantity] = useState(1);
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => prev + 1);

  return (
    <div className="relative w-[164px] h-[76px] bg-blue-600 rounded-md">


      <button
        onClick={decrease}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-4xl text-white h-full"
      >
        -
      </button>
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-white">
        {quantity}
      </p>

      <button
        onClick={increase}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-4xl text-white"
      >
        +
      </button>
    </div>
  );
};

export default QuantityBox;
