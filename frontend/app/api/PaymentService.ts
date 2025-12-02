// frontend/services/PaymentService.ts

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/payment";

export const createPayment = async (payload: {
  orderId: string;
  userId: string;
  amount: number;
  method: "paypal" | "crypto" | "local";
}) => {
  const res = await axios.post(`${API_URL}/create`, payload);
  return res.data;
};

export const verifyPayment = async (payload: {
  paymentId: string;
  proofImage?: string;
}) => {
  const res = await axios.post(`${API_URL}/verify`, payload);
  return res.data;
};

export const approveLocalPayment = async (paymentId: string) => {
  const res = await axios.post(`${API_URL}/approve`, { paymentId });
  return res.data;
};

export const getPaymentStatus = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
