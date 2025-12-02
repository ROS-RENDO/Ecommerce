"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Product } from "@/types/product";
import { searchProducts } from "@/app/api/ProductService";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

export default function CustomSearch() {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const data = await searchProducts(value);
      setResults(data);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  return (
    <div className="relative w-64">
      {/* Input */}
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="w-full py-2 px-4 pr-10 border rounded-2xl"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          <X size={16} />
        </button>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-[338px] bg-white border shadow-lg z-10 min-h-14 overflow-y-auto">
          {results.map((item) => (
            <Link
            href={`category/${item.category?.slug}/${item._id}`}
            key={item._id}
              className="flex justify-between items-center gap-2 p-4 border-b last:border-0 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-start gap-1">
                <Image src={item.images[0]?.url} alt={item.name} width={400} height={400} className="w-10 h-10 object-cover" />
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <span className="text-sm ml-2">{item.name}</span>
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm text-gray-500">{item.category?.name}</span>
                  </div>

                  <div className="flex items-center ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{item.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({item.numReviews})</span>
                  </div>

                </div>
              </div>
              <span className="text-sm text-gray-500">Stk: {item.stock}</span>
              <span className="text-sm text-gray-500">${item.price}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
