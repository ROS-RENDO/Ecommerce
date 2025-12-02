"use client";
import React, { useState, useEffect } from "react";

interface QuantityBoxProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (newQuantity: number) => void;
}

const QuantityBox: React.FC<QuantityBoxProps> = ({
  initialQuantity = 1,
  min = 1,
  max,
  onChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const decrease = () =>
    setQuantity((prev) => Math.max(min, prev - 1));

  const increase = () =>
    setQuantity((prev) => (max ? Math.min(max, prev + 1) : prev + 1));

  // notify parent when quantity changes
  useEffect(() => {
    if (onChange) onChange(quantity);
  }, [quantity, onChange]);

  return (
    <div className="flex items-center justify-between w-[164px] h-[60px] bg-blue-600 rounded-md px-4">
      <button
        onClick={decrease}
        className="text-3xl text-white w-10 h-10 flex items-center justify-center hover:bg-blue-700 rounded-md"
      >
        -
      </button>

      <p className="text-2xl text-white">{quantity}</p>

      <button
        onClick={increase}
        className="text-3xl text-white w-10 h-10 flex items-center justify-center hover:bg-blue-700 rounded-md"
      >
        +
      </button>
    </div>
  );
};

export default QuantityBox;
