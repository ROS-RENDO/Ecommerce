'use client'
import { useState } from "react";
import React from "react";
import StepTracker from "@/components/ui/StepTracker";
import { Package, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Cardcart";
import AnimatedLoader from "@/components/ui/AnimatedLoader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProcessingOrder() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderStatus, setOrderStatus] = useState<"processing" | "done">("processing");
  
    const processingSteps = [
    { label: "Order Placed", status: "completed" as const },
    { label: "Packing", status: "current" as const },
    { label: "Shipping", status: "pending" as const },
    { label: "Delivered", status: "pending" as const }
  ];

  // Simulate completion after 3 seconds for demo
  React.useEffect(() => {
    if (orderStatus === "processing") {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setOrderStatus("done");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  if (orderStatus === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Processing Your Order
            </h1>
            <p className="text-gray-600 text-lg">{`We're preparing your items with care`}</p>
          </div>

          <Card className="mb-8 border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <StepTracker steps={processingSteps} />

              {isProcessing && (
                <div className="mt-12 space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-full">
                      <AnimatedLoader type="spinner" size="md" />
                      <span className="text-blue-700 font-medium">Processing your order...</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Order Progress</span>
                      <span className="text-blue-600 font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 rounded-xl">
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-green-800 mb-1">Order Confirmed</h3>
                      <p className="text-green-600 text-sm">Your order has been received</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl animate-pulse">
                      <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-blue-800 mb-1">Packing Items</h3>
                      <p className="text-blue-600 text-sm">Carefully preparing your order</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl opacity-50">
                      <Truck className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-600 mb-1">Ready to Ship</h3>
                      <p className="text-gray-500 text-sm">Waiting for pickup</p>
                    </div>
                  </div>
                </div>
              )}

              {!isProcessing && (
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-3">Order Confirmed!</h3>
                  <p className="text-gray-600 mb-2">Order #ORD-2024-12345 has been placed successfully</p>
                  <p className="text-sm text-gray-500 mb-6">{`You'll receive a confirmation email shortly`}</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                    <Button variant="outline">Continue Shopping</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // You can add a fallback UI here if needed
  return null;
}
