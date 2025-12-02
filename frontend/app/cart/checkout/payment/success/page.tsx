'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get('token'); // PayPal order ID
      const payerId = searchParams.get('PayerID');

      if (!token) {
        setStatus('error');
        setMessage('Missing payment information');
        return;
      }

      try {
        // Get payment ID from localStorage (set it before redirecting to PayPal)
        const paymentId = localStorage.getItem('pendingPaymentId');
        
        if (!paymentId) {
          setStatus('error');
          setMessage('Payment session expired');
          return;
        }

        // Call backend to capture the PayPal payment
        const response = await fetch(`${API_URL}/api/payment/capture-paypal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentId: paymentId,
            paypalOrderId: token
          })
        });

        const data = await response.json();

        if (response.ok && data.payment) {
          setStatus('success');
          setMessage('Payment completed successfully!');
          
          // Clear stored payment ID
          localStorage.removeItem('pendingPaymentId');
          
          // Redirect to order processing page
          setTimeout(() => {
            router.push(`/cart/checkout/payment/processing/${data.payment.orderId}`);
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to capture payment');
        }
      } catch (error) {
        console.error('Capture error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment');
      }
    };

    capturePayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to order tracking...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/cart')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}