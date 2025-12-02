import API from "@/lib/api";
import { Order } from "@/types/order";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createOrder = async (orderData: any) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      throw new Error("Failed to create order");
    }
    return await res.json();
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
};

export const updateStatus = async (orderId: any, status: String) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }), // Fixed: wrap status in object
    });
    if (!res.ok) {
      throw new Error("Failed to update status");
    }
    return await res.json();
  } catch (error) {
    console.error("Error updating order status", error);
  }
};

export const userOrder = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_URL}/api/orders/my-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user order");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching order ", error);
    throw error;
  }
};

export const OrderById = async (OrderId: String) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/${OrderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch order by Id");
    }
    return res.json(); // Added return statement
  } catch (error) {
    console.error("Error fetching orderId", error);
    throw error; // Added throw to propagate error
  }
};

export const getAllOrder = async () => {
  try {
    const res = await fetch(`${API_URL}/api/orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch all orders");
    }
    return res.json(); // Added return statement
  } catch (error) {
    console.error("Error fetching orders ", error);
    throw error; // Added throw to propagate error
  }
};

export const getOrderStats = async()=>{
  try {
    const res= await fetch(`${API_URL}/api/orders/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return res.json()
  } catch (error) {
    console.error("Err fetching stats", error)
  }
}

export const addPayment = async (orderId: string, paymentData: any) => {
  try {
    // Use the correct endpoint: /api/payment/create
    const res = await fetch(`${API_URL}/api/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
      credentials: "include",
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Payment API Error:", res.status, data);
      
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      
      throw new Error(data.message || `Payment failed with status ${res.status}`);
    }

    // If PayPal, store payment ID for later capture
    if (data.paymentId) {
      localStorage.setItem('pendingPaymentId', data.paymentId);
    }

    console.log("Payment created:", data);
    return data;
    
  } catch (error) {
    console.error("Server Error:", error);
    throw error;
  }
};
