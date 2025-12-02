import React, { useState, useRef } from 'react';
import { CreditCard, Truck, Zap, User, MapPin, Phone, Mail, Package, Clock, X, GripVertical } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useCart } from '@/hooks/useCart';
import { useMyOrders } from '@/hooks/useOrder';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/app/api/OrderService';
import { triggerCartRefresh } from '@/utils/events';

const CartSidebar = () => {
  const router = useRouter();

  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });

  const isOpen = useSidebarStore((state) => state.isOpen);
  const closeSidebar = useSidebarStore((state) => state.close);

  const { cart, loading, error, fetch, addItem, updateItem, removeItem } = useCart();
  const { orders, loading: ordersLoading } = useMyOrders();

  React.useEffect(() => {
    if (isOpen) {
      fetch();
    }
  }, []);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      const newX = e.clientX - dragRef.current.startX;
      const newY = e.clientY - dragRef.current.startY;
      
      const maxX = window.innerWidth - 384;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position]);

  const shippingCost = selectedShipping === 'express' ? 9.99 : 4.99;

  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ) || 0;

  const total = subtotal + shippingCost;

  // Get last order's shipping address with proper validation
  const lastOrder = orders?.[0];
  const savedAddress = lastOrder?.shippingAddress;

  // Check if all required fields exist and are not empty
  const hasCompleteAddress = savedAddress && 
    savedAddress.firstName?.trim() && 
    savedAddress.lastName?.trim() && 
    savedAddress.email?.trim() && 
    savedAddress.street?.trim() && 
    savedAddress.city?.trim() && 
    savedAddress.state?.trim() && 
    savedAddress.zipCode?.trim() && 
    savedAddress.country?.trim();

  const handleCreateOrder = async () => {
    if (!selectedPayment || isCreatingOrder) return;

    // If no complete address, redirect to checkout
    if (!hasCompleteAddress) {
      router.push(`/cart/checkout?shipping=${selectedShipping}`);
      return;
    }

    // Validate cart
    if (!cart?.items || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsCreatingOrder(true);

    // Ensure all required fields are present with proper values
    const shippingAddress = {
      firstName: savedAddress.firstName?.trim() || "",
      lastName: savedAddress.lastName?.trim() || "",
      email: savedAddress.email?.trim() || "",
      street: savedAddress.street?.trim() || "",
      city: savedAddress.city?.trim() || "",
      state: savedAddress.state?.trim() || "",
      zipCode: savedAddress.zipCode?.trim() || "",
      country: savedAddress.country?.trim() || ""
    };

    // Double-check that no field is empty
    const emptyFields = Object.entries(shippingAddress)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      console.error("Missing required fields:", emptyFields);
      alert(`Missing required address fields: ${emptyFields.join(', ')}. Please update your address.`);
      setIsCreatingOrder(false);
      router.push(`/cart/checkout?shipping=${selectedShipping}`);
      return;
    }

    const orderData = {
      items: cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingType: selectedShipping,
      shippingcost: shippingCost,
      email: shippingAddress.email,
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      paymentMethod: selectedPayment,
      totalPrice: total
    };

    try {
      const res = await createOrder(orderData);
      console.log("Order created:", res);
      
      triggerCartRefresh();
      closeSidebar();
      router.push('/orders');
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className="absolute w-96 bg-white shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 opacity-70" />
              <Zap className="w-5 h-5" />
              <h2 className="font-bold text-lg">Fast Checkout</h2>
            </div>
            <button 
              onClick={closeSidebar}
              className="hover:bg-white/20 p-1 rounded"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Your Order</h3>
            <div className="space-y-3">
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <img 
                        src={item.product.images?.[0]?.url || '/placeholder.png'} 
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm leading-tight mb-1">{item.product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                        <span className="font-semibold text-gray-800 text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Your cart is empty</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Delivery Address
            </h3>
              
            {hasCompleteAddress ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    {savedAddress.firstName} {savedAddress.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{savedAddress.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-700">
                      {savedAddress.street}, {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}
                    </div>
                    <div className="text-gray-600">{savedAddress.country}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  No delivery address found. Please add one to continue.
                </p>
              </div>
            )}
            
            <button 
              className="text-blue-600 text-sm mt-2 hover:underline" 
              onClick={() => router.push(`/cart/checkout?shipping=${selectedShipping}`)}
            >
              {hasCompleteAddress ? 'Change Address' : 'Add Address'}
            </button>
          </div>

          {/* Shipping Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Shipping
            </h3>
            <div className="space-y-2">
              <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                selectedShipping === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={selectedShipping === 'standard'}
                  onChange={(e) => setSelectedShipping(e.target.value)}
                  className="mr-3"
                />
                <Package className="w-4 h-4 text-green-500 mr-2" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Standard</span>
                    <span className="font-semibold text-sm">$4.99</span>
                  </div>
                  <p className="text-xs text-gray-500">5-7 days</p>
                </div>
              </label>

              <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                selectedShipping === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={selectedShipping === 'express'}
                  onChange={(e) => setSelectedShipping(e.target.value)}
                  className="mr-3"
                />
                <Clock className="w-4 h-4 text-orange-500 mr-2" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Express</span>
                    <span className="font-semibold text-sm">$9.99</span>
                  </div>
                  <p className="text-xs text-gray-500">1-2 days</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              Payment
            </h3>
            <div className="space-y-2">
              {[
                { id: 'paypal', name: 'PayPal', color: 'bg-blue-600', icon: 'PP' },
                { id: 'creditcard', name: 'Credit Card', color: 'bg-gray-700', icon: '💳' },
                { id: 'crypto', name: 'Crypto', color: 'bg-orange-500', icon: '₿' },
                { id: 'localbank', name: 'Local Bank', color: 'bg-green-600', icon: '🏦' }
              ].map((method) => (
                <label key={method.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-3"
                  />
                  <div className={`w-6 h-6 rounded-full ${method.color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                    {method.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-700">{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-300 pt-2 mt-3">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Apply
              </button>
            </div>
          </div>

          {/* Complete Order Button */}
          <button 
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              selectedPayment && !isCreatingOrder && (cart?.items?.length ?? 0) > 0 && hasCompleteAddress
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.01]' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedPayment || isCreatingOrder || !(cart?.items?.length ?? 0) || !hasCompleteAddress}
            onClick={handleCreateOrder}
          >
            {isCreatingOrder ? 'Processing...' : `Complete Order • ${total.toFixed(2)}`}
          </button>

          {/* Security Badge */}
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;