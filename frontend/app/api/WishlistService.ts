const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
import { Wishlist } from "@/types/wishlist";

export const addToWishlist=async(productId: string): Promise<Wishlist>=>{
    try {
        const res= await fetch(`${API_URL}/api/wishlist`,{
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({productId}),
        });
        if (!res.ok) throw new Error("Failed to add to wishlist")
        const data= await res.json();
        return data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
};

export const fetchWishlist= async(): Promise<Wishlist>=>{
    try {
        const res= await fetch(`${API_URL}/api/wishlist`,{
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!res.ok) throw new Error("Failed to fetch wishlist")
        const data= await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching wiwshlist:", error)
        throw error;
    }
}

export const removeFromWishlist= async(productId: string): Promise<Wishlist> =>{
    try {
        const res= await fetch(`${API_URL}/api/wishlist/${productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
        });
        if(!res.ok) throw new Error("Failed to remove from wishlist");
        const data= await res.json();
        return data; 
    } catch (error) {
        console.error("Error removing from wishlist:", error)
        throw error;
    }
}