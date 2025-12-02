'use client';

import { use } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, MapPin, Clock, Eye, ChevronRight, Star, ShoppingBag, RefreshCw, AlertCircle, User, Wifi, WifiOff } from 'lucide-react';
import { useOrderById } from '@/hooks/useOrder';
import { io, Socket } from 'socket.io-client';

interface OrderStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'waiting_admin';
  estimatedTime?: string;
  requiresAdminConfirmation?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OrderProcessingPage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  const { orderId } = use(params);
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [deliveryProgress, setDeliveryProgress] = useState<number>(0);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { order, loading, error, refetch } = useOrderById(orderId);

  const steps: OrderStep[] = [
    {
      id: 'Pending',
      title: 'Order Pending',
      description: 'Your order has been received and is pending confirmation',
      icon: <Clock className="w-6 h-6" />,
      status: 'pending',
      estimatedTime: '5-10 min',
      requiresAdminConfirmation: true
    },
    {
      id: 'Processing',
      title: 'Processing & Packing',
      description: 'Your order is being processed and packed',
      icon: <Package className="w-6 h-6" />,
      status: 'pending',
      estimatedTime: '1-2 hours',
      requiresAdminConfirmation: true
    },
    {
      id: 'Shipped',
      title: 'Shipped',
      description: 'Your package is on the way',
      icon: <Truck className="w-6 h-6" />,
      status: 'pending',
      estimatedTime: '2-4 hours',
      requiresAdminConfirmation: true
    },
    {
      id: 'Delivered',
      title: 'Delivered',
      description: 'Package delivered successfully',
      icon: <MapPin className="w-6 h-6" />,
      status: 'pending',
      estimatedTime: 'Complete'
    }
  ];

  const [orderSteps, setOrderSteps] = useState<OrderStep[]>(steps);

  const updateStepStatuses = useCallback((activeStepIndex: number) => {
    setOrderSteps(currentSteps => 
      currentSteps.map((step, index) => ({
        ...step,
        status: index < activeStepIndex ? 'completed' : 
               index === activeStepIndex ? 'active' : 'pending'
      }))
    );
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!orderId) return;

    const socketInstance = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id);
      setIsConnected(true);
      socketInstance.emit('join-order', orderId);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('joined-order', (data) => {
      console.log('Joined order room:', data);
    });

    socketInstance.on('order-updated', (data) => {
      console.log('Order update received:', data);
      setLastUpdate(new Date(data.updatedAt));
      
      if (data.status === 'Cancelled') {
        setIsCancelled(true);
        setIsProcessing(false);
        return;
      }

      const stepIndex = steps.findIndex(step => step.id === data.status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
        updateStepStatuses(stepIndex);
        
        if (stepIndex >= steps.length - 1) {
          setIsProcessing(false);
        }
      }

      // Optionally refetch to ensure data consistency
      refetch();
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.emit('leave-order', orderId);
        socketInstance.disconnect();
      }
    };
  }, [orderId, refetch, updateStepStatuses]);

  // Initial order state setup
  useEffect(() => {
    if (order && !loading) {
      if (order.status === 'Cancelled') {
        setIsCancelled(true);
        setIsProcessing(false);
        return;
      }

      const stepIndex = steps.findIndex(step => step.id === order.status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
        updateStepStatuses(stepIndex);
        
        if (stepIndex >= steps.length - 1) {
          setIsProcessing(false);
        }
      }
    }
  }, [order, loading, updateStepStatuses]);

  // Update step statuses for waiting admin
  useEffect(() => {
    if (!isProcessing || !orderId || loading) return;
    
    const currentStepData = orderSteps[currentStep];
    if (currentStepData?.requiresAdminConfirmation && currentStepData.status !== 'completed') {
      setOrderSteps(currentSteps => 
        currentSteps.map((step, index) => ({
          ...step,
          status: index < currentStep ? 'completed' : 
                 index === currentStep ? 'waiting_admin' : 'pending'
        }))
      );
    }
  }, [currentStep, isProcessing, orderId, loading]);

  // Delivery progress animation
  useEffect(() => {
    if (currentStep >= 2) {
      const progressInterval = setInterval(() => {
        setDeliveryProgress(prev => {
          const newProgress = prev + 2;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [currentStep]);

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsProcessing(true);
    setOrderSteps(steps);
    setShowMap(false);
    setDeliveryProgress(0);
    setIsCancelled(false);
    setLastUpdate(new Date());
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading order...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading order: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const totalAmount = order?.items?.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  ) || 0;

  const getStepColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-100 border-green-300';
      case 'active': return 'text-blue-500 bg-blue-100 border-blue-300 animate-pulse';
      case 'waiting_admin': return 'text-orange-500 bg-orange-100 border-orange-300';
      default: return 'text-gray-400 bg-gray-100 border-gray-200';
    }
  };

  const getConnectorColor = (index: number): string => {
    return currentStep > index ? 'bg-green-500' : 'bg-gray-200';
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 10) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-red-600">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2">Order Cancelled</h1>
              <p className="text-xl opacity-90">Order #{orderId}</p>
            </div>

            <div className="p-8 text-center">
              <div className="bg-red-900 bg-opacity-50 rounded-xl p-6 mb-8 border border-red-700">
                <h2 className="text-2xl font-bold text-red-300 mb-4">
                  Your order has been cancelled by admin
                </h2>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                    Order processing has been stopped
                  </p>
                  <p className="flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-2 text-red-400" />
                    Cancelled on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={resetAnimation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800">Order #{orderId}</span>
              <div className={`ml-2 flex items-center gap-1 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Processing Your Order
            </h1>
            <p className="text-gray-600 text-lg">
              Track your order progress in real-time
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
            
            {orderSteps.map((step, index) => (
              <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                <div className={`
                  relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-700 transform
                  ${getStepColor(step.status)}
                  ${step.status === 'active' || step.status === 'waiting_admin' ? 'scale-110 shadow-lg' : ''}
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : step.status === 'waiting_admin' ? (
                    <div className="flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-500" />
                      <RefreshCw className="w-3 h-3 text-orange-500 animate-spin ml-1" />
                    </div>
                  ) : (
                    <div className={`transition-all duration-500 ${
                      step.status === 'active' ? 'animate-bounce' : ''
                    }`}>
                      {step.icon}
                    </div>
                  )}
                </div>

                {index < orderSteps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-16 transition-all duration-1000">
                    <div className={`w-full transition-all duration-1000 ${getConnectorColor(index)}`}
                         style={{ 
                           height: currentStep > index ? '100%' : '0%',
                           transitionDelay: `${index * 200}ms`
                         }}>
                    </div>
                  </div>
                )}

                <div className="ml-8 flex-1">
                  <div className={`
                    bg-white rounded-xl p-6 shadow-lg transition-all duration-700 transform
                    ${step.status === 'active' ? 'shadow-xl scale-105 border-l-4 border-blue-500' : ''}
                    ${step.status === 'waiting_admin' ? 'shadow-xl scale-105 border-l-4 border-orange-500' : ''}
                    ${step.status === 'completed' ? 'border-l-4 border-green-500' : ''}
                  `}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`
                          text-xl font-bold mb-2 transition-colors duration-500
                          ${step.status === 'completed' ? 'text-green-700' : 
                            step.status === 'active' ? 'text-blue-700' : 
                            step.status === 'waiting_admin' ? 'text-orange-700' : 'text-gray-500'}
                        `}>
                          {step.title}
                        </h3>
                        <p className={`
                          transition-colors duration-500
                          ${step.status === 'completed' ? 'text-green-600' : 
                            step.status === 'active' ? 'text-blue-600' : 
                            step.status === 'waiting_admin' ? 'text-orange-600' : 'text-gray-400'}
                        `}>
                          {step.status === 'waiting_admin' ? 'Waiting for admin confirmation...' : step.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                      </div>
                    </div>
                    
                    {step.status === 'waiting_admin' && (
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-600 font-medium">
                            Pending admin review
                          </span>
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-orange-500">
                          You'll be notified instantly when status changes
                        </div>
                      </div>
                    )}

                    {step.status === 'completed' && (
                      <div className="mt-4">
                        <div className="inline-flex items-center text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order Summary
            </h3>
            {order?.items?.map((product) => (
              <div key={product.product._id} className="flex items-center space-x-4 mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0 border-gray-100">
                <img
                  src={product.image.url}
                  alt={product.product.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{product.product.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                    <span className="font-bold text-blue-600">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Overall Progress</h3>
                <p className="text-sm text-gray-600">
                  {currentStep >= orderSteps.length ? 'Completed' : 
                   `Step ${currentStep + 1} of ${orderSteps.length}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(((currentStep >= orderSteps.length ? orderSteps.length : currentStep + 1) / orderSteps.length) * 100)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${((currentStep >= orderSteps.length ? orderSteps.length : currentStep + 1) / orderSteps.length) * 100}%`
                }}
              ></div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {isConnected ? 'Real-time updates active' : 'Reconnecting...'}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {formatTimeAgo(lastUpdate)}
                </span>
              </div>
            </div>
          </div>

          {!isProcessing && !isCancelled && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 animate-fade-in">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2 text-center">
                Order Delivered!
              </h2>
              <p className="text-green-700 mb-4 text-center text-sm">
                Your order has been successfully delivered. Thank you for shopping with us!
              </p>
              <button
                onClick={resetAnimation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Track Another Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}