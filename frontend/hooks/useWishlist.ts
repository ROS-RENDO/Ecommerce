// hooks/useWishlist.ts
import { useState, useEffect } from "react";
import { addToWishlist as addService, fetchWishlist as fetchService, removeFromWishlist as removeService } from "@/app/api/WishlistService";
import { Wishlist } from "@/types/wishlist";
export function useWishlist() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchService();
      setWishlist(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addService(productId);
      setWishlist(data);
    } catch (err: any) {
      setError(err.message || "Failed to add to wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeService(productId);
      setWishlist(data);
    } catch (err: any) {
      setError(err.message || "Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchWishlist();
  }, []);



  return { wishlist, loading, error, fetchWishlist, addToWishlist, removeFromWishlist };
}
