'use client'

import CartLoader from '@/components/ui/Loading'
import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CheckoutCard from '@/components/ui/CheckoutCard';

import { createOrder } from '@/app/api/OrderService';
import { useCart } from '@/hooks/useCart';

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shippingMethod = searchParams.get('shipping') || 'standard';
  const shipping = shippingMethod === 'express' ? 15.99 : 7.99;

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const { cart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  const Subtotal = cart?.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0) || 0;
  const total = Subtotal + shipping;

  // Form validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Check if cart is empty
    if (!cart || !cart.items || cart.items.length === 0) {
      setSubmitError('Your cart is empty');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    setSubmitError('');
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare order data to match your backend expectation
      const orderData = {
        // Shipping address fields (destructured from formData)
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
        // Shipping method and cost
        shippingType: shippingMethod,
        shippingcost: shipping
      };

      console.log('Submitting order data:', orderData); // For debugging

      const result = await createOrder(orderData);

      if (result?.message === "Order created successfully" && result?.order?._id) {
        // Success! Redirect to payment or success page
        router.push(`/cart/checkout/payment?orderId=${result.order._id}&total=${total.toFixed(2)}`);
      } else {
        setSubmitError(result?.message || 'Failed to create order. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      setSubmitError(
        error?.message || 
        error?.response?.data?.message || 
        'Failed to create order. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Suspense fallback={<div><CartLoader /></div>}>
      <div>
        <h1 className='text-[36px] font-normal w-full px-20 mt-10 py-2'>Checkout</h1>
        
        {submitError && (
          <div className="mx-20 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <div className='flex px-20 justify-between '>
          <div className='w-[668px] min-h-[561px] border px-5 py-5'>
            <h1 className='text-[20px] mb-4'>Shipping Information</h1>
            <div>
              <div className="mb-4">
                <p className='text-[16px] mt-2 py-2'>Email Address *</p>
                <input
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-[40px] border px-5 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className='flex justify-between gap-4 mb-4'>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>First Name *</p>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>Last Name *</p>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <p className='text-[16px] mt-2 py-2'>Street Address *</p>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full h-[40px] border px-5 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div className='flex justify-between gap-4 mb-4'>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>City *</p>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>State *</p>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className='flex justify-between gap-4 mb-6'>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>Zip code *</p>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
                <div className="flex-1">
                  <p className='text-[16px] mt-2 py-2'>Country *</p>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full h-[40px] border px-5 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isLoading}
                className={`flex justify-center items-center w-full h-[45px] border mt-5 rounded transition-all duration-200 ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 hover:opacity-90 cursor-pointer'
                  }`}
              >
                <p className='text-[15px] text-white font-medium'>
                  {isLoading ? 'Creating Order...' : 'Create Order & Continue to Payment'}
                </p>
              </button>
            </div>
          </div>

          <div className='w-[668px] min-h-[561px] border px-5 py-5 text-[20px]'>
            <h1 className="mb-4">Order Summary</h1>
            <CheckoutCard items={cart?.items} />

            <div className='bg-black h-0.5 w-full my-4'></div>
            <div className='flex justify-between px-5 mt-5 py-2'>
              <p className='text-[#565656] text-[13px]'>Subtotal</p>
              <p className='text-[13px]'>${Subtotal.toFixed(2)}</p>
            </div>
            <div className='flex justify-between px-5 py-3'>
              <p className='text-[#565656] text-[13px]'>
                Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})
              </p>
              <p className='text-[13px]'>${shipping.toFixed(2)}</p>
            </div>
            <div className='bg-black h-0.5 w-full my-2'></div>
            <div className='flex justify-between px-5 py-3'>
              <p className='text-[#565656] text-[16px] font-bold'>Total</p>
              <p className='text-[16px] font-normal text-[#1800ED]'>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default page;