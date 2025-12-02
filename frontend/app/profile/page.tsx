'use client'
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Settings, Heart, 
  ShoppingBag, Star, Award, Home, Package, Users, BarChart3, Bell, 
  Search, Menu, X, ChevronRight, TrendingUp, DollarSign, Eye, 
  CreditCard, Truck, Clock, CheckCircle, XCircle, Filter, Box
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';

import { useProfile } from '@/hooks/useProfile';
import { useMyOrders } from '@/hooks/useOrder';

interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  totalSpent: number;
  monthlySpent: number;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const { profile, loading, error, refetch: fetchProfile }= useProfile();
  const { orders } = useMyOrders();

  // Mock data - replace with your actual data hooks

  

  const summary: OrderSummary = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "Pending").length,
    shippingOrders: orders.filter(o => o.status === "Shipped").length,
    completedOrders: orders.filter(o => o.status === "Delivered").length,
    totalSpent: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    monthlySpent: orders
      .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, o) => sum + o.totalPrice, 0)
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; subtitle: string; color: string }> = 
    ({ icon, label, value, subtitle, color }) => (
    <div className={`relative overflow-hidden rounded-xl ${color} p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg group cursor-pointer`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[15px] text-gray-600 mb-2">{label}</h3>
          <p className="text-[36px] font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-[12px] text-gray-500">{subtitle}</p>
        </div>
        <div className="w-[48px] h-[48px] rounded-full bg-opacity-20 flex justify-center items-center">
          {icon}
        </div>
      </div>
    </div>
  );

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      Delivered: 'bg-green-100 text-green-800 border-green-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const statusIcons = {
      Pending: Clock,
      Shipped: Truck,
      Delivered: CheckCircle,
      Cancelled: XCircle
    };

    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];

    return (
      <div className="w-[860px] bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center">
              <Package size={24} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Order #{order._id}</h3>
              <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status as keyof typeof statusColors]} flex items-center gap-1`}>
            {StatusIcon && <StatusIcon size={12} />}
            {order.status}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{order.items.length} items</span>
            <span className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 "
            onClick={() => router.push(`/cart/checkout/payment/processing?orderId=${order._id}&total=${order.totalPrice}`)}
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-center items-center mb-8">
        <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
          <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
            DASHBOARD
          </h1>
        </div>
      </div>

      <div>
        <h1 className="text-[32px] text-gray-900 mb-2">Welcome back, {profile?.firstname} {profile?.lastname}!</h1>
        <p className="text-[15px] text-gray-600">Here is what's happening in your orders</p>
        <div className="w-full h-0.5 bg-gray-300 mt-5"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          icon={<Box size={20} className="text-blue-600" />}
          label="Total Orders" 
          value={summary.totalOrders} 
          subtitle="All time orders"
          color="bg-blue-50 border border-blue-100"
        />
        <StatCard 
          icon={<Clock size={20} className="text-yellow-600" />}
          label="Pending Orders" 
          value={summary.pendingOrders} 
          subtitle="Await Processing"
          color="bg-yellow-50 border border-yellow-100"
        />
        <StatCard 
          icon={<Truck size={20} className="text-purple-600" />}
          label="Shipping Orders" 
          value={summary.shippingOrders} 
          subtitle="Await Shipping"
          color="bg-purple-50 border border-purple-100"
        />
        <StatCard 
          icon={<CheckCircle size={20} className="text-green-600" />}
          label="Completed Orders" 
          value={summary.completedOrders} 
          subtitle="Successfully Delivered"
          color="bg-green-50 border border-green-100"
        />
        <StatCard 
          icon={<DollarSign size={20} className="text-indigo-600" />}
          label="Total Spent" 
          value={`$${summary.totalSpent.toFixed(2)}`}
          subtitle={`$${summary.monthlySpent.toFixed(2)} this month`}
          color="bg-indigo-50 border border-indigo-100"
        />
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="h-[72px] border-b border-gray-200 flex justify-start items-center px-6 gap-2">
              <Box size={16} className="text-gray-600" />
              <h2 className="text-[20px] font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-6">
              {orders.slice(0, 3).map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
              
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setActiveSection('orders')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 text-[13px] rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="w-[390px] bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[24px] font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="w-[32px] h-[32px] bg-blue-600 rounded flex justify-center items-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[16px] font-medium text-gray-900">Browse Products</p>
                <p className="text-[12px] text-gray-600">Discover new items</p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveSection('orders')}
              className="w-full border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-[32px] h-[32px] bg-green-600 rounded flex justify-center items-center">
                <Package size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-[16px] font-medium text-gray-900">Order History</p>
                <p className="text-[12px] text-gray-600">View all orders</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-full border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-[32px] h-[32px] bg-purple-600 rounded flex justify-center items-center">
                <Settings size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-[16px] font-medium text-gray-900">Account Settings</p>
                <p className="text-[12px] text-gray-600">Manage your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
        >
          <Edit3 size={18} />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-gray-700">
                    {profile?.firstname}{profile?.lastname}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transform hover:scale-110 transition-all duration-200">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.firstname} {profile?.lastname}</h2>
                <p className="text-indigo-600">{profile?.username}</p>
                <p className="text-gray-600 text-sm">Member since {profile?.createdAt && new Date(profile?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile?.firstname}
                    disabled={!isEditing}
                    className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"

                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile?.lastname}
                    disabled={!isEditing}
                    className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"

                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile?.email}
                  disabled={!isEditing}
                  className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"

                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile?._id}
                  disabled={!isEditing}
                  className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"

                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profile?.bio}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 resize-none"

                />
              </div>

              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-blue-600" />
                  <span className="text-gray-700">Orders</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{summary.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart size={20} className="text-pink-600" />
                  <span className="text-gray-700">Wishlist</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">5</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="text-gray-700">Total Spent</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">${summary.totalSpent.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-200">
            <Filter size={18} />
            Filter
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile': return renderProfile();
      case 'orders': return renderOrders();
      case 'wishlist': return <div className="text-gray-600 text-center py-20"><Heart size={64} className="mx-auto mb-4 text-pink-400" /><h2 className="text-2xl font-bold text-gray-900">Wishlist Coming Soon</h2></div>;
      case 'reviews': return <div className="text-gray-600 text-center py-20"><Star size={64} className="mx-auto mb-4 text-amber-400" /><h2 className="text-2xl font-bold text-gray-900">Reviews Coming Soon</h2></div>;
      case 'rewards': return <div className="text-gray-600 text-center py-20"><Award size={64} className="mx-auto mb-4 text-emerald-400" /><h2 className="text-2xl font-bold text-gray-900">Rewards Coming Soon</h2></div>;
      case 'settings': return <div className="text-gray-600 text-center py-20"><Settings size={64} className="mx-auto mb-4 text-blue-400" /><h2 className="text-2xl font-bold text-gray-900">Settings Coming Soon</h2></div>;
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-2xl font-bold text-gray-900">Profile</h2>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  {isActive && sidebarOpen && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {profile?.firstname}{profile?.lastname}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold truncate">{profile?.firstname} {profile?.lastname}</p>
                <p className="text-gray-600 text-sm truncate">{profile?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className={`h-full overflow-y-auto p-8 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;