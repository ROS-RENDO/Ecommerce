"use client";
import React, { useState, useEffect } from "react";
import PaymentPage from "@/components/Paymentpage";
import { useSearchParams } from "next/navigation";
import PaymentCard from "@/components/ui/PaymentCard";

import { PaymentProps } from "@/components/ui/PaymentCard";
import { useOrderById } from "@/hooks/useOrder";
import CartLoader from "@/components/ui/Loading";
import CartError from "@/components/ui/Error";

const Page = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [paymentItems, setPaymentItems] = useState<PaymentProps[]>([]);

  const { order, loading, error } = useOrderById(orderId || "");

  useEffect(() => {
    if (!order) return;

    const transformedItems: PaymentProps[] = order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image?.url || item.product.images?.[0]?.url,
    }));

    setPaymentItems(transformedItems);
  }, [order]);

  // 📌 Helper to format estimated date
  const getEstimatedDate = (daysToAdd: number) => {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // 📌 Determine shipping days from order
  const getShippingInfo = () => {
    if (!order?.shipping.type) return null;

    if (order?.shipping.type.toLowerCase() === "express") {
      return {
        label: "Express Shipping (7 days)",
        arrival: getEstimatedDate(7),
      };
    }
    return {
      label: "Standard Shipping (14 days)",
      arrival: getEstimatedDate(14),
    };
  };

  const shipping = getShippingInfo();

  if (loading) return <div><CartLoader /></div>;
  if (error) return <p><CartError message="Fail to fetch order" /></p>;

  return (
    <div>
      <h1 className="font-bold text-[36px] tracking-[0.09em] px-50 mt-20">
        CHECK OUT
      </h1>
      <div className="w-[682px] h-0.5 bg-black mt-2 ml-50"></div>

      {/* Order Items */}
      <div className="w-[1091px] min-h-[200px] border ml-50 p-10 mt-5 flex flex-col gap-10">
        <PaymentCard items={paymentItems} />
      </div>

      {/* Shipping + Payment */}
      <div className="px-50 mt-10">
        <h2 className="font-bold text-[32px]">Shipping</h2>
        <p className="font-light text-[30px]">
          {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
        </p>
        <p className="font-light text-[25px]">
          {order?.shippingAddress?.street}, {order?.shippingAddress?.city},{" "}
          {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode},{" "}
          {order?.shippingAddress?.country}
        </p>

        {/* Show only the selected shipping method */}
        {shipping && (
          <div className="mt-5">
            <h2 className="font-bold text-[32px]">{shipping.label}</h2>
            <p>Arrives {shipping.arrival}</p>
          </div>
        )}

        <div className="w-[1262.01px] h-0.5 bg-black my-5"></div>

        <h2 className="font-bold text-[32px]">Payment Method</h2>
        <PaymentPage orderId={orderId || ''} userId={order?.user} amount={order?.totalPrice || 0}/>
      </div>
    </div>
  );
};

export default Page;
