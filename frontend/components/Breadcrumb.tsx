// components/Breadcrumb.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    public_id: string;
    url: string;
    _id: string;
  }>;
}

export default function Breadcrumb() {
  const pathname = usePathname(); // e.g. /category/baby-product/68a059173395d8c44f03c317
  const segments = pathname.split("/").filter(Boolean); // remove empty strings
  const [productName, setProductName] = useState<string>("");

  // Function to fetch product name by ID
  const fetchProductName = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const products: Product[] = await response.json();
        const product = products.find(p => p._id === productId);
        return product?.name || productId;
      }
    } catch (error) {
      console.error("Failed to fetch product name:", error);
    }
    return productId; // fallback to ID if fetch fails
  };

  useEffect(() => {
    // Check if we're on a product page (4 segments: '', 'category', 'category-slug', 'product-id')
    if (segments.length >= 3) {
      const lastSegment = segments[segments.length - 1];
      // Check if last segment looks like a MongoDB ObjectId (24 hex characters)
      if (lastSegment.length === 24 && /^[a-fA-F0-9]+$/.test(lastSegment)) {
        fetchProductName(lastSegment).then(setProductName);
      }
    }
  }, [pathname]);

  const buildHref = (segment: string, index: number) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  const getDisplayName = (segment: string, index: number) => {
    // If it's the last segment and we have a product name, use that
    if (index === segments.length - 1 && productName) {
      return productName;
    }
    
    // Check if this looks like a product ID (MongoDB ObjectId pattern)
    if (segment.length === 24 && /^[a-fA-F0-9]+$/.test(segment)) {
      return productName || ""; // Show "Product" while loading
    }
    
    // For category names, decode and format
    return decodeURIComponent(segment.replaceAll("-", " "));
  };

  const shouldShowLink = (segment: string, index: number) => {
    // Don't make the current page (last segment) clickable if it's a product ID
    if (index === segments.length - 1 && segment.length === 24 && /^[a-fA-F0-9]+$/.test(segment)) {
      return false;
    }
    return true;
  };

  return (
    <nav className="text-sm text-gray-600 px-5 py-2">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="text-black hover:underline">Home</Link>
        </li>
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="text-gray-400">|</span>
            {shouldShowLink(segment, index) ? (
              <Link 
                href={buildHref(segment, index)} 
                className="text-black hover:underline capitalize"
              >
                {getDisplayName(segment, index)}
              </Link>
            ) : (
              <span className="text-gray-800 capitalize font-medium">
                {getDisplayName(segment, index)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}