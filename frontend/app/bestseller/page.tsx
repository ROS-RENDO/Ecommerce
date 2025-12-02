// app/best-sellers/page.tsx
import React from 'react'
import BestSellerCard from '@/components/ui/bestsellercard'
import Image from 'next/image'

// Mock product data - Replace with actual API call
const getBestSellers = async () => {
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
      isBestSeller: true,
      rank: 1
    },
    {
      id: 2,
      name: 'Ultra Comfort Gaming Chair',
      price: 449.99,
      rating: 4.8,
      soldCount: 3120,
      category: 'furniture',
      description: 'Ergonomic design with lumbar support, 360° swivel',
      imageUrl: '/products/gaming-chair.jpg',
      isBestSeller: true,
      rank: 2
    },
    {
      id: 3,
      name: 'Smart Coffee Maker Deluxe',
      price: 189.99,
      rating: 4.7,
      soldCount: 1850,
      category: 'appliances',
      description: 'App-controlled brewing, programmable timer, thermal carafe',
      imageUrl: '/products/coffee-maker.jpg',
      isBestSeller: true,
      rank: 3
    },
    {
      id: 4,
      name: 'Portable Bluetooth Speaker Max',
      price: 129.99,
      rating: 4.9,
      soldCount: 4500,
      category: 'electronics',
      description: 'Waterproof, 20-hour battery, 360° sound',
      imageUrl: '/products/speaker.jpg',
      isBestSeller: true,
      rank: 4
    },
    {
      id: 5,
      name: 'Professional Stand Mixer',
      price: 349.99,
      rating: 4.8,
      soldCount: 1200,
      category: 'appliances',
      description: '10-speed control, 5-quart capacity, multiple attachments',
      imageUrl: '/products/mixer.jpg',
      isBestSeller: true,
      rank: 5
    },
    {
      id: 6,
      name: 'LED Desk Lamp Smart',
      price: 79.99,
      rating: 4.6,
      soldCount: 2800,
      category: 'home',
      description: 'Adjustable brightness, USB charging port, eye-care tech',
      imageUrl: '/products/desk-lamp.jpg',
      isBestSeller: true,
      rank: 6
    },
    {
      id: 7,
      name: 'Wireless Mechanical Keyboard',
      price: 159.99,
      rating: 4.7,
      soldCount: 1650,
      category: 'electronics',
      description: 'RGB backlight, hot-swappable switches, 75% layout',
      imageUrl: '/products/keyboard.jpg',
      isBestSeller: true,
      rank: 7
    },
    {
      id: 8,
      name: 'Premium Yoga Mat Set',
      price: 69.99,
      rating: 4.8,
      soldCount: 3400,
      category: 'fitness',
      description: 'Extra thick, non-slip, includes carry strap and blocks',
      imageUrl: '/products/yoga-mat.jpg',
      isBestSeller: true,
      rank: 8
    }
  ]
}

const Page = async () => {
  const products = await getBestSellers()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className='w-full h-[326px] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex flex-col justify-center items-center relative overflow-hidden'>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-20 translate-y-20"></div>
        
        {/* Trophy icon with animation */}
        <div className="relative mb-4">
          <Image 
            src="/Icon/champion.png" 
            alt="champion" 
            width={99} 
            height={99} 
            className='animate-bounce z-10'
          />
          <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        <h1 className='font-extrabold text-5xl text-white mb-3 z-10 drop-shadow-lg'>
          Best Sellers
        </h1>
        <p className='font-normal text-base text-white/95 z-10'>
          Our most popular products loved by thousands of customers
        </p>
      </div>

      {/* Products Grid */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <BestSellerCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6'>
          <div className='text-center p-6 bg-white rounded-2xl shadow-md border border-orange-100'>
            <div className='text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2'>
              {products.reduce((acc, p) => acc + p.soldCount, 0).toLocaleString()}+
            </div>
            <p className='text-gray-600 font-medium'>Total Items Sold</p>
          </div>
          <div className='text-center p-6 bg-white rounded-2xl shadow-md border border-orange-100'>
            <div className='text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2'>
              {products.length}
            </div>
            <p className='text-gray-600 font-medium'>Best Selling Products</p>
          </div>
          <div className='text-center p-6 bg-white rounded-2xl shadow-md border border-orange-100'>
            <div className='text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2'>
              4.8⭐
            </div>
            <p className='text-gray-600 font-medium'>Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page