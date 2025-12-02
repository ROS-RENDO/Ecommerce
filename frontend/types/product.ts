// types/product.ts
import { Category } from "./category";

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface ProductVariantImage {
  public_id: string;
  url: string;
}

export interface ProductVariant {
  sku?: string;       // optional SKU
  color?: string;
  size?: string;
  material?: string;
  stock?: number;
  price?: number;     // can override main price
  images?: ProductVariantImage[];
}

export interface ProductReview {
  user: string;       // user ID
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;      // base price
  description: string;
  discount?: number;  // percentage
  category?: Category;
  brand?: string;
  
  colors?: string[];
  stock: number;
  
  variants?: ProductVariant[]; // optional
  images: ProductImage[];
  
  reviews?: ProductReview[];
  numReviews?: number;
  rating?: number;
  
  tags?: string[];

  status?: "Out_of_stock" | "Low_of_stock" | "Active"; // virtual field
  createdAt: string;
  updatedAt: string;
}
