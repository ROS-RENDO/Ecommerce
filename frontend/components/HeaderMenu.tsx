"use client";
import React from "react";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional weights
  variable: "--font-outfit",
});

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div
      className={`hidden md:flex w-1/2 gap-5 items-center ml-5 text-[12px] ${outfit.variable} font-medium capitalize space-x-10`}
    >
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-amber-700 hoverEffect relative group ${
            pathname === item?.href && "text-red-600"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-white hoverEffect group-hover:w-1/2 group-hover:left-0 ${
              pathname === item.href && "w-1/2"
            }`}
          ></span>
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-white hoverEffect group-hover:w-1/2 group-hover:right-0 ${
              pathname === item.href && "w-1/2"
            }`}
          ></span>
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
