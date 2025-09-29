"use client";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import { useState } from "react";
import { products } from "@/data/products";
import RelativeCard from "@/components/RelativeCard";
import React from "react";
import Review from "@/components/Review";
import Quantitybox from "@/components/ui/Quantitybox";

type productpageprop = {
  params: Promise<{ category: string }>;
};
export default function ProductPage({ params }: productpageprop) {
  const {category} = React.use(params);
  const categoryProducts = products[category as keyof typeof products];
  const product = categoryProducts[0];
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || "bg-amber-300"
  );
   const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="px-30 py-5">
      <div className="text-xs text-gray flex flex-wrap gap-1">
        <Breadcrumb />
      </div>

      <div className="flex w-full">
        {/* Left side - image section */}
        <div className="w-[671px] h-[1001px] relative flex flex-col">
          {/* Main big image */}
          <div className="w-[674px] h-[572px]">
            <div className="relative w-[671px] h-[420px]">
              <Image
                src="/assets/Iphone16pm.png"
                alt="laptop"
                fill
                className="object-cover"
              />
            </div>
            {/* Thumbnails - add margin-top here */}
            <div className="flex gap-4 mt-5 justify-center">
              <Image
                src="/assets/rogstrix.png"
                alt="laptop"
                width={123}
                height={123}
                className="object-contain border"
              />
              <Image
                src="/assets/rogstrix.png"
                alt="laptop"
                width={123}
                height={123}
                className="object-contain border"
              />
              <Image
                src="/assets/rogstrix.png"
                alt="laptop"
                width={123}
                height={123}
                className="object-contain border"
              />
              <Image
                src="/assets/rogstrix.png"
                alt="laptop"
                width={123}
                height={123}
                className="object-contain border"
              />
            </div>
          </div>
          <div className="py-10 w-[721.41px] h-[368px] flex">
            <div>
              <div>
                <h1 className="px-10 font-light text-[33px] text:shadow">
                  Asus Rog Strix
                </h1>
                <div className="relative flex">
                  <h1 className="font-normal text-[36px] px-10 text-[#F950FF]">
                    1799.99$
                  </h1>
                  <span className="text-[16px] text-[#FF3434] rotate-330 absolute top-0 left-[10px]">
                    -39%
                  </span>

                  <h2 className="font-normal text-[16px] text-[#AFAFAF] mr-4 absolute right-0 top-5">
                    2799.99$
                  </h2>
                  <div className="w-[65px] h-0.5 bg-[#AFAFAF] absolute right-4 top-8 "></div>
                </div>
              </div>
              <div className="w-[147px] h-0.5 bg-black ml-10"></div>
              <p className="font-light text-[13px] py-2 px-10">
                500+ bought in past month
              </p>
              <div className="flex px-10 gap-0.5">
                <Image
                  src="/Icon/star.png"
                  alt="star"
                  width={22}
                  height={10}
                ></Image>
                <Image
                  src="/Icon/star.png"
                  alt="star"
                  width={22}
                  height={10}
                ></Image>
                <Image
                  src="/Icon/star.png"
                  alt="star"
                  width={22}
                  height={10}
                ></Image>
                <Image
                  src="/Icon/star.png"
                  alt="star"
                  width={22}
                  height={10}
                ></Image>
                <Image
                  src="/Icon/star.png"
                  alt="star"
                  width={22}
                  height={10}
                ></Image>
                <p className="px-2">(142)</p>
              </div>
              <div className="relative w-[275px] h-[87px]">
                <p className="absolute px-7 font-light text-[13px] tracking-[0.09em] py-1">
                  FEEDBACK
                </p>
                <div className="absolute w-[91px] h-0.5 bg-black ml-7 mt-7"></div>

                <Image
                  src="/Icon/shipping.png"
                  alt="shipping"
                  className="absolute top-3 right-30"
                  width={23}
                  height={23}
                ></Image>
                <p className="absolute right-0 top-3 font-light text-[13px] tracking-[0.09em]">
                  SHIPPING 24/7
                </p>
                <Image
                  src="/Icon/Gurantee.png"
                  alt="Gurantee"
                  className="absolute top-9 right-30"
                  width={23}
                  height={23}
                ></Image>
                <p className="absolute right-0 top-9 font-light text-[13px] tracking-[0.09em]">
                  100% GURANTEE
                </p>
                <Image
                  src="/Icon/warranty.png"
                  alt="warranty"
                  className="absolute top-15 right-30"
                  width={23}
                  height={23}
                ></Image>
                <p className="absolute right-0 top-15 font-light text-[13px] tracking-[0.09em]">
                  2 Years Warranty
                </p>
              </div>
              <div className="ml-5 w-[237px] h-[59px] flex justify-center items-center">
                {product.colors?.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="relative w-[40px] h-[40px] rounded-full cursor-pointer flex items-center justify-center"
                  >
                    {/* Sliding border effect */}
                    <div
                      className={`absolute inset-0 rounded-full transition-transform duration-150 ease-in-out
                      ${
                        selectedColor === color
                          ? "border-2 border-black scale-100"
                          : "scale-0 border-2 border-transparent"
                      }
                    `}
                    ></div>

                    {/* Stable background circle */}
                    <div
                      className={`w-[30px] h-[30px] rounded-full z-10 ${color}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-0.5 h-[352px] bg-black"></div>
            <div className="px-4 py-10 w-[432px] h-[170px] flex flex-col gap-y-4">
              <p className="uppercase text-[21px] font-regular">
                Nexus ROCK STrix scar 17 gaming laptop 15.7” 1TB SSD 16 RAM RAM
                PRO
              </p>
              <p className="uppercase text-[19px] font-light tracking-[0.09em]">
                The ASUS ROG Strix SCAR 17 is a powerful gaming laptop built for
                high performance, fast visuals, and smooth gameplay. Its ideal
                for serious gamers and creators who want speed, style, and
                reliability.
              </p>
            </div>
          </div>
        </div>
        <div className="ml-20 gap-y-10 w-[534px] min-h-[1005px]">
          <ul className="flex gap-4 justify-center items-center mb-7">
            RAM
            <li className="w-[54px] h-[33px] ml-2 border  flex justify-center items-center">
              8GB
            </li>
            <li className="w-[54px] h-[33px] border  flex justify-center items-center">
              16GB
            </li>
            <li className="w-[54px] h-[33px] border  flex justify-center items-center">
              32GB
            </li>
            <li className="w-[54px] h-[33px] border  flex justify-center items-center">
              64GB
            </li>
          </ul>

          <div className="grid grid-cols-2 grid-rows-4">
            <p className="font-bold ml-10 text-[18px]">Brand</p>
            <p className="-translate-x-10">NewSUS Tech Company</p>
            <p className="font-bold ml-10 text-[18px]">Size</p>
            <p className="-translate-x-10">15.7*11.1*1.0inches(W*D*H)</p>
            <p className="font-bold ml-10 text-[18px]">Weight</p>
            <p className="-translate-x-10">6.28pound</p>
            <p className="font-bold ml-10 text-[18px]">Delivery</p>
            <p className="-translate-x-10">Phnom Penh Cambodia</p>
            <p className="font-bold ml-10 text-[18px]">Variant</p>
            <div>
              <ul className="-translate-x-20 gap-x-14 gap-y-3 grid grid-cols-3 mb-5">
                <li className="w-[90px] h-[35px] text-[14px] text-nowrap border border-black flex justify-center items-center p-2">
                  Off White
                </li>
                <li className="w-[90px] h-[35px] text-[14px] text-nowrap border border-black flex justify-center items-center p-2">
                  Space Gray
                </li>
                <li className="w-[90px] h-[35px] text-[14px] text-nowrap border border-black flex justify-center items-center p-2">
                  Jet Black
                </li>
                <li className="w-[90px] h-[35px] text-[14px] text-nowrap border border-black flex justify-center items-center p-2">
                  Cinnamon Red
                </li>
              </ul>
            </div>
            <p className="font-bold ml-10 text-[18px] flex items-center mb-7">
              Quantity
            </p>
            <div className="absolute right-1/3 top-120">
              <Quantitybox />
            </div>
          </div>
          <div className="relative w-[493px] border border-black px-5 py-4 flex flex-col ml-10">
            <p className="font-semibold text-[22px]">$1799.99</p>
            <div className="w-full h-0.5 bg-black mb-1"></div>
            <div className="flex gap-1">
              <Image
                src="/Icon/plus.png"
                alt="plus"
                width={10}
                height={10}
                className="w-5 h-5"
              ></Image>
              <p className="text-[13px] font-normal text-[#828282]">
                Add shipping insurance for $9( declared value only if the
                package gets lost, stolen or damaged.)
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="w-[220px] h-[56px] flex px-10 bg-[#3C215F] mt-2 justify-center items-center ml-10 gap-2">
              <Image
                src="/Icon/Cart.png"
                alt="cart"
                width={35}
                height={10}
                className="w-5 h-5"
              ></Image>
              <button className="text-white text-[16px] "> SHOP NOW</button>
            </div>
            <div className="w-[220px] h-[56px] flex px-10 border mt-2 justify-center items-center ml-13 gap-2">
              <Image
                src="/Icon/basket.png"
                alt="cart"
                width={35}
                height={10}
                className="w-5 h-5"
              ></Image>
              <button className="text-[#8F8F8F] text-[16px] text-nowrap">
                ADD TO BASKET
              </button>
            </div>
          </div>
          <div className="underline px-20 mt-3 text-[20px] font-light tracking-[0.09em]">
            CUSTOMER REVIEW
          </div>
          <div className="px-25 text-[15px] font-normal py-2">
            <span>101,378</span> Global Rating
          </div>
          <div className="px-10 gap-8 flex flex-col">
            <div className="flex gap-8">
              <p className="text-nowrap">5 Star</p>
              <div className="w-[343px] border h-[26px] relative">
                <div className="absolute w-[80%] h-full bg-[#FFD814]"></div>
              </div>
              <p>80%</p>
            </div>
            <div className="flex gap-8">
              <p className="text-nowrap">4 Star</p>
              <div className="w-[343px] border h-[26px] relative">
                <div className="absolute w-[80%] h-full bg-[#FFD814]"></div>
              </div>
              <p>80%</p>
            </div>
            <div className="flex gap-8">
              <p className="text-nowrap">3 Star</p>
              <div className="w-[343px] border h-[26px] relative">
                <div className="absolute w-[80%] h-full bg-[#FFD814]"></div>
              </div>
              <p>80%</p>
            </div>
            <div className="flex gap-8">
              <p className="text-nowrap">2 Star</p>
              <div className="w-[343px] border h-[26px] relative">
                <div className="absolute w-[80%] h-full bg-[#FFD814]"></div>
              </div>
              <p>80%</p>
            </div>
            <div className="flex gap-8">
              <p className="text-nowrap">1 Star</p>
              <div className="w-[343px] border h-[26px] relative">
                <div className="absolute w-[80%] h-full bg-[#FFD814]"></div>
              </div>
              <p>80%</p>
            </div>

            <div className="flex justify-center items-center gap-x-4">
              <input
                placeholder="Write a customer review "
                className="w-[182px] h-[47px] text-center rounded-[13px] border"
              ></input>
              <p className="text-[15px] font-normal text-nowrap text-[#6D6DFF] underline">
                How the customer review and rating work
              </p>
            </div>

            <div className="flex gap-2 ">
              <Image
                src="/Icon/Profile.png"
                alt="profile"
                width={40}
                height={40}
                className=""
              ></Image>
              <input
                placeholder="Write your comment "
                className="w-[336px] h-[36px] text-start px-5 rounded-[13px] border"
              ></input>
              <div className="rounded-full relative w-[43px] h-[43px] border flex justify-center items-center">
                <Image
                  src="/Icon/Send.png"
                  alt="send"
                  width={40}
                  height={40}
                  className="absolute w-[26px] h-[26px]"
                ></Image>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1305px] h-[468px]">
        <p className="p-2 underline text-[20px] font-light tracking-[0.09em]">
          DESCRIPTION
        </p>
        <div className="w-[1298px] h-[82px] bg-[#D9D9D9] flex justify-center items-center">
          <p className="px-5 text-[14px] font-normal">
            The iPhone 14 Pro and Pro Max feature a Super Retina XDR OLED
            display with a typical maximum brightness of 1,000 nits. However, it
            can go all the way up to 1,600 nits while watching HDR videos, and
            2,000 nits outdoors. The display has a refresh rate of 120 Hz and
            utilizes LTPO technology.
          </p>
        </div>

        <p className="px-2 py-2 mt-8 underline text-[20px] font-light tracking-[0.09em]">
          SPECIFICATION
        </p>
        <div className="w-[1305px] h-[278px] relative">
          <div className="flex flex-col w-[594px] h-[278px] absolute top-0 left-0 bg-[#D9D9D9] p-8">
            <div className="flex">
              <p className="text-[14px] font-normal ">Display</p>
              <p className="text-[14px] font-normal text-white px-10">
                17.3-inch FULL HD (1920 x 1090) IPS panel, 144Hz refresh rate,
                3ms responsive time, 100% sRGB color gamut, Adaptive-Sync
                technology, anti-glare
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal ">Processor</p>
              <p className="text-[14px] font-normal text-white px-6">
                10th Gen Intel Core i9-10980HK (8 cores, 16 threads, 2.4GHz
                base, up to 5.3GHz turbo)
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal ">Graphics</p>
              <p className="text-[14px] font-normal text-white px-8">
                NVIDIA GeForce RTX 3080 (16GB GDDR6 VRAM)
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal ">Memory</p>
              <p className="text-[14px] font-normal text-white px-8">
                32GB DDR4-3200 RAM
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal ">Storage</p>
              <p className="text-[14px] font-normal text-white px-9">
                1TB PCIe NVMe M.2 SSD
              </p>
            </div>
          </div>

          <div className="flex flex-col w-[594px] h-[278px] absolute top-0 right-0 bg-[#D9D9D9] p-8">
            <div className="flex">
              <p className="text-[14px] font-normal">Audio</p>
              <p className="text-[14px] font-normal text-white px-12">
                2 x 4W speakers with Smart Amp technolory
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal">Connection</p>
              <p className="text-[14px] font-normal text-white  px-4">
                Wi-Fi 6 (802.11ax), Bluetooth 5.1, Gigabit Ethernet, HDMI 2.0b,
                USD 3.2 Gen 2 Type-c with DisplayPort 1.4 and Power Delivery, 3
                x USB 3.2 Gen 1 Type-A, 3.5mm audio
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal">Keyboard</p>
              <p className="text-[14px] font-normal text-white px-7">
                Backlit Chiclet keyboard, N-key rollover, per-key RGB lightning,
                Aura Sync technology
              </p>
            </div>

            <div className="flex py-1">
              <p className="text-[14px] font-normal">Battery</p>
              <p className="text-[14px] font-normal text-white px-11">
                4-cell 90Wh lithium battery (Up to 8 hours battery)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1302px] h-0.5 bg-black mt-10"></div>
      <div className="font-semibold text-[24px] py-2">Related Products</div>
      <div className="flex justify-between">
        {[1,2,3, 4].map((id)=> (
          <RelativeCard
            key={id}
            id={id}
            selected={selectedId === id}
            onSelect={() => setSelectedId(id)}
          />
        ))}
      </div>

      <div className="font-semibold text-[24px] py-2">Popularity</div>
      <div className="flex justify-between">
        {[5,6,7,8].map((id)=> (
          <RelativeCard
            key={id}
            id={id}
            selected={selectedId === id}
            onSelect={() => setSelectedId(id)}
          />
        ))}
      </div>
      <h1 className="w-full text-center text-[30px] py-2 tracking-[0.09em] uppercase">Review Product</h1>
      <div className="w-full h-[250px] border flex justify-between items-center px-5">
        <Review />
        <Review />
        <Review />
        <Review />
      </div>
    </div>
  );
}
