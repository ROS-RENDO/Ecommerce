// types/order.ts
import { Payment } from "./payment";
import { Product } from "./product";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  image: {
    public_id: string;
    url: string;
  };
}

export interface ShippingAddress {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Shipping {
  type: "standard" | "express";
  cost: number;
}

export interface Order {
  _id: string;
  user: string; // User ID
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shipping: Shipping;
  payment?: Payment;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}
