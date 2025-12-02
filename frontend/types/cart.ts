// types/cart.ts
import { Product } from "./product";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string; // User ID
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
