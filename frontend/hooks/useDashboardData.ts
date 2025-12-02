import { useState, useEffect } from 'react';
import { getProfile, getCustomer } from '@/app/api/profileService';
import { getOrderStats, getAllOrder } from '@/app/api/OrderService';
import { fetchProduct } from '@/app/api/ProductService';
import { fetchCategories } from '@/app/api/CategoryService';

import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { Customer } from '@/types/cutomer';
import { Category } from '@/types/category';

export function useDashboardData() {
  const [profile, setProfile] = useState<{ firstname: string; lastname: string; email: string } | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0,
    totalProducts: 0,
    productsGrowth: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<{ name: string; value: number; color: string }[]>([]);

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  ];

  useEffect(() => {
    // Fetch all dashboard data in parallel
    const fetchData = async () => {
      try {
        const [profileData, statsData, ordersData, productsData, customersData, categoriesData] = await Promise.all([
          getProfile(),
          getOrderStats(),
          getAllOrder(),
          fetchProduct(),
          getCustomer(),
          fetchCategories(),
        ]);

        setProfile(profileData);
        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData);
        setCustomers(customersData);

        const formattedCategories = categoriesData.map((cat: Category, idx: number) => ({
          name: cat.name,
          value: cat.products ? cat.products.length : 0,
          color: COLORS[idx % COLORS.length],
        }));

        setCategories(formattedCategories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return { profile, stats, orders, products, customers, categories, setOrders, setProducts };
}
