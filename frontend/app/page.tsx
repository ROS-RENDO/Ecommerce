"use client";
import Image from "next/image";
import { CategoryItem } from "@/app/category/CategoryItem";
import Link from "next/link";
import CustomSearch from "@/components/CustomSearch";
import ScollSlider from "@/components/ScollSlider";
import { ProductComponent } from "@/components/ProductComponent";
import Categorybar from "@/components/Categorybar";
import { products } from "@/data/products";
import React, { useEffect, useState } from "react";
import { fetchCategories } from "./api/CategoryService";
import { fetchProduct } from "./api/ProductService";

const categoryImages: Record<string, string> = {
  clothing: "/assets/clothing.png",
  electronics: "/assets/Electronics.png",
  beauty: "/assets/Beauty.png",
  furniture: "/assets/Furniture.png",
  digital: "/assets/Digitalproduct.png",
  software: "/assets/Software.png",
  hardware: "/assets/Hardware.png",
  car: "/assets/Car.png",
  equipment: "/assets/Equipment.png",
  "pet-care": "/assets/Petcare.png",
  food: "/assets/Food.png",
  accessories: "/assets/Accessories.png",
  "baby-product": "/assets/Babyproduct.png",
  shoes: "/assets/Shoes.png",
  screen: "/assets/Screen.png",
  books: "/assets/Book.png",
  ticket: "/assets/Ticket.png",
  health: "/assets/Health.png",
  household: "/assets/Household.png",
  media: "/assets/Media.png",
};

export default function Home() {
  const [product] = useState([
    ...products.electronics,
    ...products.clothing,
    ...products.beauty,
  ]);
  const [categories, setCategories] = useState<
    { name: string; slug: string; imageSrc: string; href: string }[]
  >([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const mapped = data.map((cat: { name: string; slug: string }) => ({
          name: cat.name,
          slug: cat.slug,
          imageSrc: categoryImages[cat.slug] || "/assets/default.png",
          href: `/category/${cat.slug}`,
        }));
        setCategories(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);
  const menuItems = ["Discount", "Coupon", "Event", "Free Shipping"];
  const [isOpen, setIsOpen] = useState(false);

  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  return (
    <div>
      <div className="relative flex px-60 py-8 gap-4 ">
        <h2 className="underline">CATEGORY</h2>
        <div className="relative flex justify-center items-center">
          {/* Trigger Button */}
          <h2
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-52 h-9 px-4 flex justify-between items-center text-white bg-[rgb(255,95,95)] cursor-pointer rounded"
          >
            🎁 SPECIAL OFFERS
            <Image
              src="/assets/down.png"
              alt="down"
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width={20}
              height={20}
            />
          </h2>

          {/* Dropdown Menu */}
          {isOpen && (
            <ul className="absolute top-full mt-2 w-52 bg-white shadow-lg rounded text-sm text-gray-800 z-10">
              {menuItems.map((item) => (
                <li
                  key={item}
                  className="px-4 py-2 hover:bg-[rgb(255,240,240)] cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    // Add your logic here (e.g., redirect, filter)
                    console.log("Selected:", item);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="absolute right-0 mr-50 flex">
          <CustomSearch />
          <button
            type="submit"
            className="text-white bg-[#3C215F] active:bg-[#673f9a] ml-2 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-10 grid-rows-2 gap-3 px-60 relative ">
        {categories.map((cat) => (
          <Link key={cat.slug} href={cat.href}>
            <CategoryItem name={cat.name} imageSrc={cat.imageSrc} />
          </Link>
        ))}
        <div className="absolute right-0 top-[50px] mr-50">
          <Image
            src="/assets/down.png"
            alt="down"
            width={50}
            height={50}
            className="rotate-270 fill-black"
          />
        </div>
      </div>

      <div className="relative w-full h-[300px] mt-10 px-50 flex ">
        <ScollSlider />
      </div>

      <div className="relative w-full p-4">
        <div className="relative flex flex-col gap-8">
          {categories.map((cat) => {
            const filteredProducts = shuffleArray(
              product.filter(
                (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
              )
            );

            if (filteredProducts.length === 0) return null;

            return (
              <div key={cat.slug} className="p-4 relative">
                <div className="flex justify-between items-center mb-4 ">
                  <h3 className="text-lg font-semibold ">{cat.name}</h3>
                  <button
                    className="cursor-pointer underline text-blue-600"
                    onClick={() => {
                      window.location.href = `/category/${cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`;
                    }}
                  >
                    <Categorybar />
                    View All
                  </button>
                </div>

                <div className="flex gap-20 overflow-x-auto scrollbar-hide">
                  {filteredProducts.map((item) => (
                    <ProductComponent
                      key={item.id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                      category={item.category}
                      slug={item.slug}
                      id={item.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
