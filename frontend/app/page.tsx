"use client";
import Image from "next/image";
import { CategoryItem } from "@/app/category/CategoryItem";
import Link from "next/link";
import CustomSearch from "@/components/CustomSearch";
import ScollSlider from "@/components/ScollSlider";
import React, { useEffect, useState } from "react";
import { fetchCategories } from "./api/CategoryService";
import { fetchFeaturedProducts } from "./api/ProductService";
import TrustPilotCarousel from "@/components/main/TrustPilotCarousel";
import PaymentScroll from "@/components/main/paymentscroll";
import RecommendCarousel from "@/components/main/RecommendCarousel";
import { Zap, Truck, ShieldCheck, Award, Headphones, TrendingUp } from "lucide-react";
import AnimatedShowcaseGrid from "@/components/main/Collection";
import PromoBanner from "@/components/main/PromoBanner";
import PremiumCommunitySection from "@/components/main/PremiumCommunitySection";
import MegaPromotionCenter from "@/components/main/bigpromo";
import AutoRotatingCategorySection from "@/components/main/AutoRotatingCategorySection";
import ProductCard from "@/components/ProductCard";
import { CategoryWithImage } from "@/types/category";
import { Product } from "@/types/product";
import AnimatedStatsSection from "@/components/main/AnimatedStatsSection";
import NewsletterSection from "@/components/main/NewsletterSection";

// Constants
const SPECIAL_OFFERS_MENU = ["Discount", "Coupon", "Event", "Free Shipping"];

const CATEGORY_IMAGES: Record<string, string> = {
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

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
      {feature.icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
    <p className="text-gray-600">{feature.description}</p>
  </div>
);

const features: Feature[] = [
  { icon: <Zap className="w-8 h-8" />, title: "Lightning Fast", description: "Experience blazing-fast performance with our cutting-edge technology." },
  { icon: <Truck className="w-8 h-8" />, title: "Free Shipping", description: "Free shipping on all orders over $100. No hidden fees." },
  { icon: <ShieldCheck className="w-8 h-8" />, title: "Secure Payment", description: "Your transactions are protected with SSL encryption." },
  { icon: <Award className="w-8 h-8" />, title: "Premium Quality", description: "We only offer products that meet our high standards." },
  { icon: <Headphones className="w-8 h-8" />, title: "24/7 Support", description: "Our customer service team is always ready to help you." },
  { icon: <TrendingUp className="w-8 h-8" />, title: "Best Prices", description: "Competitive pricing and regular discounts for our customers." },
];

const SpecialOffersDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative flex justify-center items-center">
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

      {isOpen && (
        <ul className="absolute top-full mt-2 w-52 bg-white shadow-lg rounded text-sm text-gray-800 z-10">
          {SPECIAL_OFFERS_MENU.map((item) => (
            <li
              key={item}
              className="px-4 py-2 hover:bg-[rgb(255,240,240)] cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                console.log("Selected:", item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories()
      .then((data: unknown) => {
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }

        const mapped: CategoryWithImage[] = data.map((item: any) => {
          return {
            _id: item._id,
            name: item.name,
            slug: item.slug,
            products: item.products || [],
            imageSrc: CATEGORY_IMAGES[item.slug] || "/assets/default.png",
            href: `/category/${item.slug}`,
          };
        });

        setCategories(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);

  // Fetch featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchFeaturedProducts(8);
        console.log('Featured products loaded:', data); // Debug log
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="relative flex px-60 py-8 gap-4">
        <h2 className="underline">CATEGORY</h2>
        <SpecialOffersDropdown />
        <div className="absolute right-0 mr-50 flex">
          <CustomSearch />
          <button
            type="submit"
            className="text-white bg-[#3C215F] active:bg-[#673f9a] ml-2 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-10 grid-rows-2 gap-3 px-60 relative">
        {categories.map((cat) => (
          <Link key={cat._id} href={cat.href}>
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

      {/* Slider */}
      <div className="relative w-full h-[300px] mt-10 px-50 flex">
        <ScollSlider />
      </div>

      {/* Auto-Rotating Category Section */}
      <AutoRotatingCategorySection categories={categories} />

      {/* Big Summer Sale Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative h-80 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-12">
            <div className="text-white max-w-xl">
              <h1 className="text-5xl font-bold mb-4">Big Summer Sale</h1>
              <p className="text-xl mb-6">Up to 50% off on selected items</p>
              <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition">
                Shop Now
              </button>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500"
                alt="Sale"
                className="h-72 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">Our Products</h2>
        <p className="text-center text-gray-600 mb-12">Shop By Category</p>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us</h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            We're committed to delivering exceptional quality and service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      <RecommendCarousel />
      
      <PremiumCommunitySection />

      <AnimatedShowcaseGrid />

      <PaymentScroll />
      
      <MegaPromotionCenter />

      <TrustPilotCarousel />

      <PromoBanner />

      {/* Brand Logos */}
      <div className="flex w-full justify-evenly mt-40">
        <Image
          src="/assets/brand/adidas.png"
          alt="Adidas"
          width={120}
          height={80}
          className="w-[120px] h-[80px] object-cover"
        />
        <Image
          src="/assets/brand/calvinklein.png"
          alt="Calvin Klein"
          width={180}
          height={100}
          className="w-[180px] h-[100px] object-cover"
        />
        <Image
          src="/assets/brand/chanel.png"
          alt="Chanel"
          width={100}
          height={120}
          className="w-[100px] h-[120px] object-cover"
        />
        <Image
          src="/assets/brand/gucci.png"
          alt="Gucci"
          width={100}
          height={100}
          className="w-[100px] h-[100px] object-cover"
        />
        <Image
          src="/assets/brand/louisvuitton.png"
          alt="Louis Vuitton"
          width={100}
          height={100}
          className="w-[100px] h-[100px] object-cover"
        />
        <Image
          src="/assets/brand/rolex.png"
          alt="Rolex"
          width={150}
          height={80}
          className="w-[150px] h-[80px] object-cover"
        />
      </div>

      {/* Stats Section */}
      <AnimatedStatsSection/>

      {/* Newsletter Section */}
      <NewsletterSection/>
    </div>
  );
}