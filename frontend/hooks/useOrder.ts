// hooks/useOrders.ts
import { useState, useEffect } from "react";
import { Order } from "../types/order";
import * as orderService from "@/app/api/OrderService"

// Fetch current user orders
export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.userOrder();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: () => orderService.userOrder() };
}

// Fetch a single order by ID
export function useOrderById(orderId: string) {
  const [order, setOrder] = useState<Order| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.OrderById(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  return { order, loading, error, refetch: () => orderService.OrderById(orderId) };
}

// Fetch all orders (admin)
export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getAllOrder();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch all orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: () => orderService.getAllOrder() };
}

// Fetch order statistics
export function useOrderStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => orderService.getOrderStats() };
}
