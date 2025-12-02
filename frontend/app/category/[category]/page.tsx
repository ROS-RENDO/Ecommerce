"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";

import Productdetail from "@/app/category/productdetail";
import Product from "@/app/category/product";
import { subcategories } from "@/data/subcategories";
import { fetchProduct } from "@/app/api/ProductService";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  url: string;
  public_Id: string;
  _id: string;
  alt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  images: ProductImage[];
  colors: string[];
}
export default function CategoryPage({ params }: { params: Promise<{ category: string }>}) {
  const {category} = React.use(params);

  const [product, setProduct]= useState<Product[]>([])

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const categorySubcategories = subcategories[category as keyof typeof subcategories] || [];



  useEffect(()=>{
    fetchProduct()
    .then((data)=>{
      setProduct(data);
    })
    .catch((err)=>{
      console.error(err)
    })
  }, [])
  
  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
  );
  };


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

      <div className="left-0 top-0 w-full h-75 px-20 relative ">
        <div className="absolute min-w-[513px] h-[248px] flex bg-white border-[#3E0C7F] border-3 flex-col rounded-[10px] p-6 text-[21px] font-light gap-5">
          <div className="flex gap-2 items-center">
            Price:
            <input
              type="number"
              className="w-[106px] h-[34px] border border-black text-center placeholder:text-center placeholder:text-[15px] font-light text-[15px] ml-6"
              placeholder="From"
            />
            <div className="w-4 h-0.5 bg-black mt-1.5" />
            <input
              type="number"
              className="w-[106px] h-[34px] border border-black text-center placeholder:text-center placeholder:text-[15px] font-light text-[15px]"
              placeholder="To"
            />
          </div>

          <div >
            Type:
            <div className="grid gap-y-2 mt-2" style={{ gridTemplateColumns: `repeat(${Math.ceil(categorySubcategories.length / 4 )}, minmax(0, 1fr))` }}>
              {categorySubcategories.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer ml-5">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                  />
                  <div className="border border-black rounded-[20px] text-[15px] font-light min-w-[86px] h-[23px] text-center">
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-13 ">
        <h1 className="text-[23px] font-light tracking-[0.20em] h-12 uppercase">{selectedTypes.join(", ")}</h1>
      </div>

      <div className="flex w-full flex-col gap-10 px-10 py-10">
        {product
        .filter((p)=> p.category.slug === category)
        .map((product) => (
          <div key={product._id} className="flex gap-10">
            <Product slug={product._id} category={category} url={product.images[0]?.url} alt={product.name} />
            <div className="flex flex-col mt-10">
              <Productdetail
                description={product.description}
                price={product.price}
                colors={product.colors}
                slug={product._id}
                category={product.category.slug}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
