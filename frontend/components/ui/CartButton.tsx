"use client";
import React, {useState} from "react";
import { addToCart } from "@/app/api/CartService";
import { triggerCartRefresh } from "@/utils/events";
import { useSidebarStore } from "@/store/useSidebarStore";
import { userOrder } from "@/app/api/OrderService";

interface addToCartButtonProps{
    productId: string;
    quantity?: number;
    className?: string;
    children?: React.ReactNode;
    onSuccess?: ()=>void;
}
const AddToCartButton: React.FC<addToCartButtonProps> =({
    productId,
    quantity= 1,
    className="",
    children = "+",
    onSuccess
}) =>{
    const [loading, setLoading]= useState(false);
    const [success, setSuccess]= useState(false);

    const openSidebar = useSidebarStore((state) => state.open);

    const handleAddToCart= async(e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        e.stopPropagation();
        try {
            setLoading(true);
            await addToCart(productId, quantity);

            const orders = await userOrder();
            const hasPreviousOrder = orders.length > 0;

            triggerCartRefresh();
            
            if (hasPreviousOrder) {
                openSidebar();
            }

            setSuccess(true);
            setTimeout(()=> setSuccess(false), 2000);

            if(onSuccess){
                onSuccess();
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        } finally{
            setLoading(false);
        }
    };

    return(
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`
        px-4 py-2 rounded transition-colors duration-200
        ${loading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : success
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-gray-500 hover:bg-gray-500'
        }
        text-black font-medium
        ${className}
      `}
        >
         {loading ? 'Adding...': success ? 'Added!': children}
        </button>
    );
};
export default AddToCartButton;