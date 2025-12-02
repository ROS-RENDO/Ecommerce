'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMyOrders } from '@/hooks/useOrder'
import { useState, useEffect } from 'react'
import OrderCard from '@/components/ui/OrderCard'
import { getProfile } from '@/app/api/profileService'


interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  totalSpent: number;
  monthlySpent: number;
}
const page = () => {
  const { orders, loading } = useMyOrders();
  const [profile, setProfile] = useState<{ firstname: string ,lastname: string } | null>(null);

  
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
      getProfile()
      .then(profile => {
        setProfile(profile);
      })
      .catch(err => console.error("Failed to fetch profile", err));
    }, []);

    if (loading) return <p className="p-4">Loading your orders...</p>;
    
    if (orders.length === 0)
      return <p className="p-4">You don’t have any orders yet.</p>;
  return (
    <div className='px-20'>
        <div className='w-full h-[120px] flex justify-center items-center'>
            <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
              <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
                DASHBOARD
              </h1>
            </div>
        </div>
        <h1 className='text-[32px] ml-5 '>Welcome back, {profile?.firstname} {profile?.lastname}!</h1>
        <p className='text-[15px] ml-5'>Here is what happening in your order</p>
        <div className='w-full h-0.5 bg-black mt-5'></div>
        <div className='flex mt-10 justify-between '>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Total Orders</h1>
                <p className='text-[36px]'>{summary.totalOrders}</p>
                <p className='text-[12px]'>All time order</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#DBEAFE] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/box.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Pending Orders</h1>
                <p className='text-[36px]'>{summary.pendingOrders}</p>
                <p className='text-[12px]'>Await Processing</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#FEF9C3] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/time.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Shipping Orders</h1>
                <p className='text-[36px]'>{summary.shippingOrders}</p>
                <p className='text-[12px]'>Await Shipping</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#e6d2ea] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/shipping.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Completed Orders</h1>
                <p className='text-[36px]'>{summary.completedOrders}</p>
                <p className='text-[12px]'>Successful Delivered</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#DCFCE7] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/tick.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Total Spent</h1>
                <p className='text-[36px]'>${summary.totalSpent.toFixed(2)}</p>
                <p className='text-[12px]'>${summary.monthlySpent.toFixed(2)} this month</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#F3E8FF] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/box.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
        </div>
        <div className='flex py-10'>
          
          <div className='ml-30'>
            <div className='w-[928px] h-[72px] border flex justify-start items-center px-5 gap-2'>
              <Image src="/Icon/box.png" alt='box' width={16} height={16} className='w-[16px] h-[16px]'></Image>
              <h1 className='text-[20px] font-semibold'>Recent Activity</h1>
            </div>
            <div className='w-[928px] min-h-[1115px] border flex flex-col justify-start items-center gap-y-8 '>
              <span className='mt-10'></span>
             {orders.map((order) => (
              <OrderCard
                key={order._id}
                orderId={order._id}
                status={order.status}
                products={order.items.map((i) => ({
                  id: i.product._id,
                  productName: i.product.name, 
                  name: i.product.name,
                  quantity: i.quantity,
                  price: i.price,
                  image: i.image.url,
                }))}
                totalAmount={order.totalPrice}
                orderDate={order.createdAt}
              />
            ))}

              
              
              <Link className='w-[135px] h-[40px] border text-[13px] flex justify-center items-center mb-5 cursor-pointer' href='/profile/dashboard/my-orders'>View All Activity</Link>
            </div>
          </div>
          <div className='border w-[390px] h-[347px] rounded-[10px] px-5 py-5 ml-50'>
            <p className='text-[24px]'>Quick Actions</p>
            <div className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#3B82F6]'>
                <Image src="/Icon/cartwhite.png" alt='cart white' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Browse Products</p>
                <p className='text-[12px] text-[#676767]'>Discover new items</p>
              </div>
            </div>
            <Link className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5 cursor-pointer' href='/profile/dashboard/my-orders'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#22C55E]'>
                <Image src="/Icon/boxwhite.png" alt='box white' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Order History</p>
                <p className='text-[12px] text-[#676767]'>View all orders</p>
              </div>
            </Link>
            <div className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#A855F7]'>
                <Image src="/Icon/setting.png" alt='setting' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Account Settings</p>
                <p className='text-[12px] text-[#676767]'>Manage your account</p>
              </div>
            </div>
    

          </div>
        </div>
    </div>
  )
}

export default page