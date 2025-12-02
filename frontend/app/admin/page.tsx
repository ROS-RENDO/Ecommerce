"use client"
import React, { useState, useEffect } from 'react';
import { getProfile, getCustomer } from '../api/profileService';
import { updateStatus } from '../api/OrderService';

import CreateProduct from '@/components/CreateProduct';
import { IconType } from 'react-icons';
import { useDashboardData } from '@/hooks/useDashboardData';


import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Bell,
  Settings,
  LogOut,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  X,
  MessageSquare,
  Send,
  Paperclip,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import AdminSupportChat from '@/components/AdminSupportChat';

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);

  // Sample chat data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 234-567-8900',
      lastMessage: 'When will my order arrive?',
      time: '2 min ago',
      unread: 2,
      status: 'online',
      orderId: '#12345'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 234-567-8901',
      lastMessage: 'Thank you for your help!',
      time: '15 min ago',
      unread: 0,
      status: 'offline',
      orderId: '#12340'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+1 234-567-8902',
      lastMessage: 'I need to return my item',
      time: '1 hour ago',
      unread: 1,
      status: 'online',
      orderId: '#12338'
    }
  ];

  const chatMessages = [
    { sender: 'customer', text: 'Hi! I ordered a product 3 days ago', time: '10:30 AM' },
    { sender: 'customer', text: 'When will my order arrive?', time: '10:31 AM' },
    { sender: 'admin', text: 'Hello Sarah! Let me check your order status for you.', time: '10:32 AM' },
    { sender: 'admin', text: 'Your order #12345 is currently out for delivery and should arrive today by 5 PM.', time: '10:33 AM' },
    { sender: 'customer', text: 'Great! Thank you so much!', time: '10:34 AM' }
  ];

  // Sample data
  const salesData = [
    { month: 'Jan', sales: 65000, orders: 145 },
    { month: 'Feb', sales: 59000, orders: 132 },
    { month: 'Mar', sales: 80000, orders: 198 },
    { month: 'Apr', sales: 81000, orders: 205 },
    { month: 'May', sales: 56000, orders: 128 },
    { month: 'Jun', sales: 95000, orders: 234 }
  ];
   const { profile, stats, orders, products, customers, categories, setOrders } = useDashboardData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Shipped': return <Package className="w-4 h-4" />;
      case 'Pending': return <AlertTriangle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };
  
  function getStatus(stock: number) {
    if (stock === 0) return "Out_of_stock";
    if (stock < 20) return "Low_stock";
    return "Active";
  }

  const StatCard = ({ title, value, change, icon: Icon, color }: { title: string; value: string; change: number; icon: IconType; color: string; }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleStatusChange = async (orderId: string, newStatus: typeof statusOptions[number]) => {
    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
    );
    try {
      const updatedOrder = await updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status: updatedOrder.status } : order))
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'support':
        return (
          <AdminSupportChat adminId={profile?.email || 'support_main'}/>
        );

      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Revenue" 
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change={stats.revenueGrowth} 
                icon={DollarSign} 
                color="bg-green-500" 
              />
              <StatCard 
                title="Total Orders" 
                value={`${stats.totalOrders}`} 
                change={stats.ordersGrowth} 
                icon={ShoppingCart} 
                color="bg-blue-500" 
              />
              <StatCard 
                title="Total Customers" 
                value={`${stats.totalCustomers}`} 
                change={stats.customersGrowth} 
                icon={Users} 
                color="bg-purple-500" 
              />
              <StatCard 
                title="Products" 
                value={`${stats.totalProducts}`} 
                change={stats.productsGrowth} 
                icon={Package} 
                color="bg-orange-500" 
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">PaymentStatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
           
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{order._id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">${(order.totalPrice + (order.shipping?.cost || 0)).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{new Date(order.createdAt).toLocaleString("en-CA", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false
                        })}</td>
                        <td className='py-3 px-4'>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Total</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">{order._id}</td>
                        <td className="py-4 px-6 text-gray-600">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">{order.totalPrice}</td>
                        <td className="py-4 px-6">
                          <select
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value as typeof statusOptions[number])}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{new Date(order.createdAt).toLocaleString("en-CA", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false
                        })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
              <div className="flex items-center gap-3">
                <button 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Product</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Stock</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const status = getStatus(product.stock);
                      return (
                        <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                          <td className="py-4 px-6 text-gray-600">{product.category?.name}</td>
                          <td className="py-4 px-6 font-medium text-gray-900">{product.price}</td>
                          <td className="py-4 px-6 text-gray-600">{product.stock}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              <span className="capitalize">{status.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Customers Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Name</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Email</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Orders</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Total Spent</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Joined</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-700">
                                {customer.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{customer.email}</td>
                        <td className="py-4 px-6 text-gray-600">{customer.totalOrders}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">{customer.totalSpent}</td>
                        <td className="py-4 px-6 text-gray-600">{new Date(customer.joined).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trends</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h4>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
                <p className="text-sm text-green-600 mt-1">+0.5% from last month</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Average Order Value</h4>
                <p className="text-2xl font-bold text-gray-900">$165</p>
                <p className="text-sm text-green-600 mt-1">+$12 from last month</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Return Rate</h4>
                <p className="text-2xl font-bold text-gray-900">2.1%</p>
                <p className="text-sm text-red-600 mt-1">+0.3% from last month</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'support', label: 'Support Chat', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">E-commerce Admin</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
              {item.id === 'support' && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{profile?.firstname} {profile?.lastname}</p>
              <p className="text-xs text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-600">Manage your e-commerce store</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Order
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] ">
              <CreateProduct onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;