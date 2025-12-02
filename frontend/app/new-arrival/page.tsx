// app/new-arrivals/page.tsx
import React from 'react'
import NewArrivalCard from '@/components/ui/newarrivalcard'
import Image from 'next/image'

// Mock product data - Replace with actual API call
const getNewArrivals = async () => {
  // Simulate API call
  return [
    {
      id: 1,
      name: 'Premium Wireless Headphones Pro',
      price: 299.99,
      rating: 4.9,
      soldCount: 2390,
      category: 'electronics',
      description: 'Industry-leading noise cancellation, 30-hour battery life',
      imageUrl: '/products/headphones.jpg',
      isNew: true
    },
    {
      id: 2,
      name: 'Smart Fitness Watch Ultra',
      price: 399.99,
      rating: 4.8,
      soldCount: 1850,
      category: 'wearables',
      description: 'Advanced health tracking, GPS, 7-day battery',
      imageUrl: '/products/watch.jpg',
      isNew: true
    },
    {
      id: 3,
      name: 'Portable Power Station 500W',
      price: 449.99,
      rating: 4.7,
      soldCount: 980,
      category: 'electronics',
      description: 'Backup power for camping and emergencies',
      imageUrl: '/products/power-station.jpg',
      isNew: true
    },
    {
      id: 4,
      name: 'Professional Camera Drone',
      price: 899.99,
      rating: 4.9,
      soldCount: 620,
      category: 'photography',
      description: '4K video, 45min flight time, obstacle avoidance',
      imageUrl: '/products/drone.jpg',
      isNew: true
    }
  ]
}

const Page = async () => {
  const products = await getNewArrivals()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className='w-full h-[326px] flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden'>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>
        
        <Image 
          src="/Icon/stararrival.png" 
          alt="champion" 
          width={99} 
          height={99} 
          className='mb-4 animate-pulse'
        />
        <h1 className='font-extrabold text-5xl text-white mb-3 z-10'>New Arrivals</h1>
        <p className='font-normal text-base text-white/90 z-10'>
          Our most products loved by thousands of customers
        </p>
      </div>

      {/* Products Grid */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <NewArrivalCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page