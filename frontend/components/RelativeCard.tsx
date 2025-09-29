import React from "react";
import Image from "next/image";

type Props = {
  id: number;
  selected: boolean;
  onSelect: () => void;
};

const RelativeCard: React.FC<Props> = ({id,  selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`w-[250px] bg-white rounded-2xl p-4 cursor-pointer transition border-2 ${
        selected ? "border-blue-500" : "border-transparent"
      }`}
    >
      <Image
        src="/assets/rogstrix.png"
        alt={`${id}`}
        width={1000}
        height={100}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full inline-block mb-2">
        NEW
      </span>

      <h2 className="text-[16px] font-semibold mb-1">Asus VivoBook S15</h2>
      <p className="text-[15px] font-bold text-green-600 mb-1">$779</p>
      <p className="text-sm text-gray-600 mb-2">
        Gaming Laptop ZDY 15.6 inch 512 GB VGA...
      </p>
      <div className="flex items-center gap-1 text-yellow-500 text-sm">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span className="text-gray-500 text-xs ml-1">(142)</span>
      </div>
    </div>
  );
};

export default RelativeCard;
