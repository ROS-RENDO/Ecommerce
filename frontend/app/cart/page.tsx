'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/context/AuthContext";
import CardComponent from "@/components/ui/CartComponent";
import CartLoader from "@/components/ui/Loading";
import CartError from "@/components/ui/Error";
import { useCart } from "@/hooks/useCart";

const Page = () => {
  const router = useRouter();
  const [selectedShipping, setSelectedShipping] = useState("standard");

  const { cart, loading, error, updateItem, removeItem } = useCart();

  // Calculate totals
  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  const shipping =
    selectedShipping === "express" ? 15.99 : selectedShipping === "standard" ? 7.99 : 0;

  const total = subtotal + shipping;

  // Handlers
  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    try {
      await updateItem(itemId, newQty);
    } catch (err) {
      console.error("Failed to update item quantity", err);
    }
  };

  const handleCheckout = () => {
    // Example payload for checkout
    const payload = {
      shipping: {
        type: selectedShipping,
        cost: shipping,
      },
      cartId: cart?._id,
    };
    console.log("Checkout payload:", payload);
    router.push(`/cart/checkout?shipping=${selectedShipping}`);
  };

  return (
    <AuthWrapper>
      <div className="px-20 py-10">
         <div className='w-full h-[120px] flex justify-center items-center '>
          <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative mb-10 ">
            <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
              CART
            </h1>
          </div>
        </div>
        <h1 className="text-[36px] font-normal mt-5">Shopping Cart</h1>


        {error && (<CartError message={error}/>)}

        {!cart || cart.items.length === 0 ? (
          <p className="text-center py-5">Your cart is empty</p>
        ) : (
          <div className="flex justify-between mt-10">
            {/* Cart Items */}
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <CardComponent
                  key={item._id}
                  _id={item._id}
                  name={item.product.name}
                  price={item.product.price}
                  image={item.product.images[0]?.url || ""}
                  quantity={item.quantity}
                  onRemoved={handleRemove}
                  onQuantityChange={(newQty) => handleQuantityChange(item._id, newQty)}
                />
              ))}
            </div>

            {/* Order Summary */}
            {cart.items.length > 0 && (
            <div className="w-[434px] h-[430px] bg-white border border-black mr-25 mt-10">
            <h1 className="p-5 text-[24px]">Order Summary</h1>
            <div className="w-full flex justify-between px-5">
              <h1 className="text-[16px]">Subtotal ({cart?.items.length || 0} item)</h1>
              <p>${subtotal.toFixed(2)}</p>
            </div>

            <div className="p-5">
              <h1 className="text-[20px]">Shipping Method</h1>
              <div className="flex flex-col">
                <div className="flex gap-2 cursor-pointer" onClick={() => setSelectedShipping("standard")}>
                  <div className="w-[20px] h-[20px] rounded-full border border-black relative ">
                    {selectedShipping === "standard" && (
                      <div className="w-[12px] h-[12px] rounded-full bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                  <p>Standard (7-8 days) - $7.99</p>
                </div>

                <div className="flex gap-2 cursor-pointer" onClick={() => setSelectedShipping("express")}>
                  <div className="w-[20px] h-[20px] rounded-full border border-black relative">
                    {selectedShipping === "express" && (
                      <div className="w-[12px] h-[12px] rounded-full bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                  <p>Express (2-3 days) - $15.99</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="ml-3">Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>

              <div className="w-[397px] h-0.5 bg-black mt-3"></div>

              <div className="flex justify-between items-center mt-3">
                <p className="font-bold">Total</p>
                <p className="text-[#3F59CC] text-[20px]">${total.toFixed(2)}</p>
              </div>

              <div className="mt-15 flex flex-col gap-2">
                <button
                  type="button"
                  className="w-[392px] h-[31px] flex justify-center items-center cursor-pointer border 
                    bg-[radial-gradient(circle,rgba(63,94,251,1)_0%,rgba(204,0,255,1)_100%)] text-white"
                  onClick={handleCheckout}
                >
                  Proceed to checkout
                </button>

                <div className="w-[392px] h-[31px] flex justify-center items-center border">
                  <p>Continue shopping</p>
                </div>
              </div>
            </div>
          </div>
            )}
          </div>
        )}
      </div>
    </AuthWrapper>
  );
};

export default Page;