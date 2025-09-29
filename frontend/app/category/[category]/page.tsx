"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { products } from "@/data/products";
import Productdetail from "@/app/category/productdetail";
import Product from "@/app/category/product";
import { notFound } from "next/navigation";
import { subcategories } from "@/data/subcategories";

export default function CategoryPage({ params }: { params: Promise<{ category: string }>}) {
  const {category} = React.use(params);
  const categoryProducts = products[category as keyof typeof products];

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<typeof categoryProducts>([]);
  const categorySubcategories = subcategories[category as keyof typeof subcategories] || [];

  useEffect(() => {
    if (categoryProducts) {
      setShuffled(shuffleArray([...categoryProducts]));
    }
  }, [categoryProducts]);

  
  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
  );
  };

  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    }
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    
    if (!categoryProducts) return notFound();
  return (
    <>
      <div className="w-full py-10 flex justify-center items-center relative">
        <div className="absolute left-[120px]">
          <Breadcrumb />
        </div>
        <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
          <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
            CATEGORY: {category.toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="left-0 top-0 w-full h-75 px-20 relative">
        <div className="absolute w-[513px] h-[248px] bg-white border-[#3E0C7F] border-3 flex flex-col rounded-[10px] p-6 text-[21px] font-light gap-5">
          <div className="flex gap-2 items-center">
            Price:
            <input
              type="number"
              value={minPrice}
              onChange={(e)=> setMinPrice(e.target.value)}
              className="w-[106px] h-[34px] border border-black text-center placeholder:text-center placeholder:text-[15px] font-light text-[15px] ml-6"
              placeholder="From"
            />
            <div className="w-4 h-0.5 bg-black mt-1.5" />
            <input
              type="number"
              value={maxPrice}
              onChange={(e)=> setMaxPrice(e.target.value)}
              className="w-[106px] h-[34px] border border-black text-center placeholder:text-center placeholder:text-[15px] font-light text-[15px]"
              placeholder="To"
            />
          </div>

          <div>
            Type:
            <div className="grid grid-cols-1 px-8 gap-y-2 mt-2">
              {categorySubcategories.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                  />
                  <div className="border border-black rounded-[20px] text-[15px] font-light w-[86px] h-[23px] text-center">
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-13 ">
        <h1 className="text-[23px] font-light tracking-[0.20em] h-12">CONTROLLER</h1>
      </div>

      <div className="flex w-full flex-col gap-10 px-10 py-10">
      {shuffled
        .filter((product) => {
          const matchType =
            selectedTypes.length === 0 || selectedTypes.includes(product.slug);

          const price = product.price;
          const min = parseFloat(minPrice);
          const max = parseFloat(maxPrice);

          const matchPrice =
            (!minPrice || price >= min) && (!maxPrice || price <= max);

          return matchType && matchPrice;
        })

        .map((product) => (
          <div key={product.id} className="flex gap-10">
            <Product slug={product.slug} category={category} image={product.image} />
            <div className="flex flex-col mt-10">
              <Productdetail
                description={product.description}
                price={product.price}
                colors={product.colors}
                slug={product.slug}
                category={product.category}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
