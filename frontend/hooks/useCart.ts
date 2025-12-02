// hooks/useCart.ts
import { useState, useEffect } from "react";
import * as cartService from "@/app/api/CartService";
import type { Cart } from "@/types/cart";

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.fetchCart(); // expected to return Cart object
      setCart(data);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.updateCartItem(itemId, quantity);
      setCart(data);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to update item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.removeFromCart(itemId);
      setCart(data);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to remove item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { cart, loading, error, fetch, addItem, updateItem, removeItem, setCart };
}
