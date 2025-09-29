import React, { useState } from 'react';

const Quantitybox = () => {
  const [value, setValue] = useState(0);
  const decrease = () => setValue(prev => Math.max(prev - 1, 1));
  const increase = () => setValue(prev => prev + 1);

  return (
    <div className="flex items-center gap-3  w-fit px-3 py-2 rounded-md ">
      {/* Decrease button */}
      <button
        onClick={decrease}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-400 text-gray-800 text-xl hover:bg-gray-200"
      >
        −
      </button>

      {/* Quantity Display */}
      <div className="text-base font-medium w-6 text-center">{value}</div>

      {/* Increase button */}
      <button
        onClick={increase}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-400 text-gray-800 text-xl hover:bg-gray-200"
      >
        +
      </button>
    </div>
  );
};

export default Quantitybox;
