// pages/MyOrders.tsx
"use client";
import React from "react";
import { useMyOrders } from "@/hooks/useOrder";
import { Order } from "@/types/order";
import Image from "next/image";

export default function MyOrders() {
  const { orders, loading } = useMyOrders();

  if (loading) return <p className="p-4">Loading your orders...</p>;

  if (orders.length === 0)
    return <p className="p-4">You don’t have any orders yet.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">My Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </ul>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="border p-4 rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            Order #{order._id.slice(-6)} – {order.shippingAddress.firstName}{" "}
            {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-gray-500">{timeAgo(order.createdAt)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs ${statusBadge(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {order.items.map((item) => (
          <li key={item.product._id} className="flex items-center gap-3">
            <Image
              src={item.image.url}
              alt={item.product.name}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="text-sm font-medium">{item.product.name}</p>
              <p className="text-xs text-gray-500">
                x{item.quantity} – ${item.price * item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 font-semibold">Total: ${order.totalPrice}</p>
    </li>
  );
}

// Helpers
function statusBadge(
  status: Order["status"] // ✅ strongly typed
): string {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
      return "bg-purple-100 text-purple-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function timeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
