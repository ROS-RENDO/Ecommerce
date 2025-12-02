import React, { useState } from 'react'
import Image from 'next/image'

interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface OrderCardProps {
  orderId: string;
  status: "Pending" | "Processing" | "Delivered" | "Shipped" | "Cancelled";
  products: Product[];
  orderDate: string;
  totalAmount: number;
}

const statusConfig: Record<
  OrderCardProps["status"],
  { icon: string; bg: string; label: string }
> = {
  Shipped: {
    icon: "/Icon/shipping.png",
    bg: "#e6d2ea",
    label: "Shipped",
  },
  Processing: {
    icon: "/Icon/box.png",
    bg: "#DBEAFE",
    label: "Processing",
  },
  Delivered: {
    icon: "/Icon/tick.png",
    bg: "#DCFCE7",
    label: "Delivered",
  },
  Pending: {
    icon: "/Icon/eye.png",
    bg: "FFFF00",
    label: "Pending",
  },
  Cancelled: {
    icon: "/Icon/eye.png",
    bg: "#FEE2E2",
    label: "Pending",
  },
};


const OrderCard: React.FC<OrderCardProps> = ({ 
  orderId, 
  status, 
  products, 
  orderDate, 
  totalAmount 
}) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { icon, bg, label } = statusConfig[status];
  
  const visibleProducts = showAllProducts ? products : products.slice(0, 1);
  const hiddenProductsCount = products.length - 1;
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <div className="flex flex-col">
      <div 
        className="w-[750px] border rounded-t-[15px] relative px-5 py-1"
        style={{ 
          height: showAllProducts ? 'auto' : '153px',
          minHeight: '157px'
        }}
      >
        <div className="flex justify-between">
          {/* Status Icon */}
          <div
            className="w-[48px] h-[48px] rounded-full absolute left-2 top-2 flex justify-center items-center"
            style={{ backgroundColor: bg }}
          >
            <Image src={icon} alt={label} width={20} height={20} />
          </div>

          {/* Title */}
          <p className="text-[20px] ml-12 py-4">Order #{orderId} {label}</p>

          {/* Status Badge */}
          <div
            className="w-[84px] h-[21px] flex justify-center items-center rounded-[20px] mt-4"
            style={{ backgroundColor: bg }}
          >
            <p className="text-[13px]">{label}</p>
          </div>
        </div>

        {/* Products List */}
        <div 
          className={`space-y-3 mt-2 ${
            !showAllProducts && products.length > 1 
              ? 'max-h-[80px] overflow-y-auto pr-2' 
              : showAllProducts && products.length > 3 
              ? 'max-h-[200px] overflow-y-auto pr-2' 
              : ''
          }`}
        >
          {!showAllProducts ? (
            // Show all products with scroll when collapsed and multiple products
            products.map((product, index) => (
              <div key={product.id} className="flex items-center">
                <div className="w-[64px] h-[64px] bg-[#D9D9D9] rounded-md flex-shrink-0">
                  {product.image && (
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="px-5 flex-1">
                  <p className="font-bold">{product.name}</p>
                  <p className="text-[13px] font-medium">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </p>
                  {index === 0 && (
                    <p className="text-[13px] text-[#737373]">{orderDate}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Show visibleProducts when expanded
            visibleProducts.map((product, index) => (
              <div key={product.id} className="flex items-center">
                <div className="w-[64px] h-[64px] bg-[#D9D9D9] rounded-md flex-shrink-0">
                  {product.image && (
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="px-5 flex-1">
                  <p className="font-bold">{product.name}</p>
                  <p className="text-[13px] font-medium">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </p>
                  {index === 0 && (
                    <p className="text-[13px] text-[#737373]">{orderDate}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary (shown when expanded or as summary when collapsed) */}
        {!showAllProducts && products.length > 1 && (
          <div className="mt-6 pl-2">
            <p className="text-[13px] font-medium">
              Total: ${totalAmount.toFixed(2)} ({totalItems} item{totalItems > 1 ? 's' : ''})
            </p>
          </div>
        )}
        {(showAllProducts || products.length === 1) && (
          <div className="mt-9 pl-2">
            <p className="text-[13px] font-medium">
              Total: ${totalAmount.toFixed(2)} ({totalItems} item{totalItems > 1 ? 's' : ''})
            </p>
            {showAllProducts && (
              <p className="text-[13px] text-[#737373]">{orderDate}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
       <div className="w-[750px] h-[68px] border rounded-b-[15px] flex justify-end items-center px-5 bg-[#DFE0EC]">
        <div 
          className="w-[127px] h-[36px] bg-[#EEF1F6] flex justify-center items-center cursor-pointer hover:bg-[#E2E8F0] transition-colors duration-200"
          onClick={() => {
            if (!showAllProducts && hiddenProductsCount > 0) {
              setShowAllProducts(true);
            } else if (showAllProducts) {
              setShowAllProducts(false);
            }
            // If all products are shown and no hidden products, this would be actual "View detail" functionality
          }}
        >
          {!showAllProducts && hiddenProductsCount > 0 
            ? `Show ${hiddenProductsCount} More`
            : showAllProducts 
            ? "Show Less"
            : "View detail >"
          }
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

// Example usage:
/*
const exampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphone',
    image: '/products/headphone.jpg',
    price: 199.10,
    quantity: 1
  },
  {
    id: '2',
    name: 'Gaming Mouse',
    price: 45.99,
    quantity: 1
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 129.99,
    quantity: 1
  },
  {
    id: '4',
    name: 'USB-C Cable',
    price: 19.99,
    quantity: 2
  }
];

<OrderCard
  orderId="ORD-001"
  status="delivered"
  products={exampleProducts}
  orderDate="2 hours ago"
  totalAmount={394.07}
/>
*/