"use client";
import { useState } from "react";
import Image from "next/image";
import { addPayment } from "@/app/api/OrderService";
import { useRouter, useSearchParams } from "next/navigation";

type PaymentMethod = "local" | "paypal" | "card" | "crypto" | "other" | null;
type CryptoType = "bitcoin" | "usdt" | "solana" | "bnb";

interface PaymentPageProp {
  orderId?: string;
  userId?: string;
  amount?: number;
}

const PaymentPage: React.FC<PaymentPageProp> = ({ 
  orderId: orderIdProp, 
  userId, 
  amount 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = orderIdProp || searchParams.get('orderId') || '';
  const total = amount || Number(searchParams.get('total')) || 0;

  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [value, setValue] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [email, setEmail] = useState('');
  const [expiry, setExpiry] = useState('');
  
  // Binance/Crypto states
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>("usdt");
  const [binanceProcessing, setBinanceProcessing] = useState(false);
  const [binanceData, setBinanceData] = useState<any>(null);

  // Crypto currency mapping for Binance
  const cryptoCurrencyMap = {
    bitcoin: "BTC",
    usdt: "USDT",
    solana: "SOL",
    bnb: "BNB",
  };

  // Helper function to create payment
  const createPayment = async (method: string, additionalData?: any) => {
    try {
      const authCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        credentials: 'include',
      });

      if (!authCheck.ok) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      const paymentData = {
        orderId: orderId,
        userId: userId || "USER1",
        amount: total,
        method: method,
        ...additionalData
      };

      console.log("Creating payment:", paymentData);
      
      const response = await addPayment(orderId, paymentData);
      
      if (response && !response.error) {
        router.push(`/cart/checkout/payment/processing/${orderId}`);
      } else {
        throw new Error(response?.message || "Payment failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      
      if (error.message?.includes("unauthorized") || error.message?.includes("401")) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
      } else {
        alert(error.message || "Payment failed. Please try again.");
      }
    }
  };

  // Handle PayPal payment flow
  const handlePayPalPayment = async () => {
    try {
      setPaypalProcessing(true);

      const authCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        credentials: 'include',
      });

      if (!authCheck.ok) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      const paymentData = {
        orderId: orderId,
        userId: userId || "USER1",
        amount: total,
        method: "paypal"
      };

      console.log("Creating PayPal payment:", paymentData);
      
      const response = await addPayment(orderId, paymentData);
      
      if (response && response.approvalUrl) {
        window.location.href = response.approvalUrl;
      } else {
        throw new Error(response?.message || "Failed to create PayPal payment");
      }
    } catch (error: any) {
      console.error("PayPal payment error:", error);
      alert(error.message || "Failed to initiate PayPal payment. Please try again.");
      setPaypalProcessing(false);
    }
  };

  // Handle Binance Payment
  const handleBinancePayment = async (currency: string) => {
    try {
      setBinanceProcessing(true);

      const authCheck = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!authCheck.ok) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payment/binance/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            userId: userId || "USER1",
            amount: total,
            currency: currency,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create Binance payment");
      }

      if (data.checkoutUrl) {
        // Redirect to Binance Pay checkout page
        window.location.href = data.checkoutUrl;
      } else if (data.qrContent) {
        // Show QR code in modal
        setBinanceData(data);
      }
    } catch (error: any) {
      console.error("Binance payment error:", error);
      alert(error.message || "Failed to initiate Binance payment. Please try again.");
    } finally {
      setBinanceProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setValue(formatted);
  };

  const handleChangedate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '').slice(0, 4);
    
    if (input.length >= 1) {
      const month = parseInt(input.slice(0, 2));
      if (month > 12) {
        input = '12' + input.slice(2);
      }
    }
    
    if (input.length >= 3) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    
    setExpiry(input);
  };

  const methods = ["local", "paypal", "card", "crypto", "other"] as const;

  const labels: Record<(typeof methods)[number], string> = {
    local: "Local Bank",
    paypal: "PayPal",
    card: "Credit Card",
    crypto: "Crypto",
    other: "Other",
  };

  const renderContent = () => {
    switch (selectedMethod) {
      case "local":
        return (
          <div className="grid grid-cols-3 gap-5">
            <button 
              onClick={() => createPayment("local", { bank: "ABA Bank" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#0F52BA] text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[80%] px-10">
                <Image
                  src="/assets/payment/aba.png"
                  alt="aba"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span className="mr-10">ABA</span>
              </div>
            </button>
            <button 
              onClick={() => createPayment("local", { bank: "Acleda Bank" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#0C3471] text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[80%] px-10">
                <Image
                  src="/assets/payment/acleda.png"
                  alt="acleda"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>Acleda</span>
              </div>
            </button>
            <button 
              onClick={() => createPayment("local", { bank: "Canadia Bank" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[40px] bg-[#E22528] text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[90%]">
                <Image
                  src="/assets/payment/canadia.png"
                  alt="canadia"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>Canadia Bank</span>
              </div>
            </button>
            <button 
              onClick={() => createPayment("local", { bank: "Wing Bank" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#90B01A] text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[80%]">
                <Image
                  src="/assets/payment/wing.png"
                  alt="wing"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>Wing Bank</span>
              </div>
            </button>
            <button 
              onClick={() => createPayment("local", { bank: "True Money" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#F29616] hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[100%] px-10">
                <Image
                  src="/assets/payment/truemoney.png"
                  alt="truemoney"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span className="text-[#FF0000]">True</span>
                <span className="text-[#FF6200]">money</span>
              </div>
            </button>
            <button 
              onClick={() => createPayment("local", { bank: "KHQR" })}
              className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#FF0105] text-white hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-between items-center w-[80%] px-10">
                <Image
                  src="/assets/payment/khqr.png"
                  alt="khqr"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>KHQR</span>
              </div>
            </button>
          </div>
        );

      case "paypal":
        return (
          <div>
            <div className="w-[1250px] h-[111px] bg-[#00258A] mt-7 flex justify-start px-10 rounded-[20px]">
              <Image
                src="/assets/payment/paypal.png"
                alt="paypal"
                width={200}
                height={200}
                className="w-[100px] h-[100px] mt-1"
              />
              <span className="text-white text-[45px] font-bold flex items-center ml-10">
                Pay<span className="text-[#00D0FF]">Pal</span>
              </span>
            </div>
            <div>
              <p className="text-[20px] font-medium mt-10">CONTINUE WITH PAYPAL</p>
              <p className="text-[16px] text-gray-600 mt-2">You will be redirected to PayPal to complete your payment securely</p>
              <div className="w-[1250px] flex justify-between items-center mt-5">
                <div className="flex-1 mr-5">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-[18px] font-semibold mb-2">Order Summary</p>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-[24px] font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  disabled={paypalProcessing}
                  className="w-[305px] h-[56px] border bg-[#0070ba] hover:bg-[#005ea6] text-white text-[26px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2" 
                  onClick={() => handlePayPalPayment()}
                >
                  {paypalProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay with PayPal'
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="flex py-40">
            <div className="flex flex-col gap-10">
              <div className="bg-gradient-to-b from-[#9C2CF3] to-[#3A49F9] w-[411px] h-[254px] rounded-[20px] relative overflow-hidden">
                <div className="w-[469px] h-[312px] rounded-[50%] border absolute -top-50 -right-60 bg-black opacity-[8%]"></div>
                <div className="w-[469px] h-[312px] rounded-[50%] border absolute -bottom-50 -left-60 bg-black opacity-[8%]"></div>
                <p className="absolute opacity-[54%] text-white text-[14px] font-medium top-10 left-10">Current Balance</p>
                <p className="absolute text-white font-medium text-[28px] left-10 top-17">$5,750,20</p>
                <div className="absolute text-[14px] font-medium text-white left-10 bottom-8">5282 3456 7890 1289</div>
                <div className="absolute text-[14px] font-medium text-white right-10 bottom-8">09/25</div>
                <div className="absolute right-5 top-5">
                  <Image src="/assets/payment/mastercard.png" alt="mastercard" width={100} height={100} className="w-[105px] h-[69px]" />
                  <p className="text-[12px] text-white absolute top-14 right-6">mastercard</p>
                </div>
              </div>
            </div>
            <div className="w-[679px] h-[817px] px-20 py-10 ml-50 border">
              <p className="text-[20px]">Pay using Credit Card</p>
              <div className="relative">
                <Image src="/assets/payment/mastercard.png" alt="mastercard" width={100} height={100} className="w-[132px] h-[76px]" />
                <p className="text-black ml-7 absolute top-15">mastercard</p>
              </div>
              <p className="text-[20px] text-[#898989] mt-10 ml-5">Credit card</p>
              <input 
                value={value} 
                onChange={handleChange} 
                className="w-[576px] h-[33px] px-5 mt-3 focus:outline-none text-[20px] focus:ring-0 focus:border-none"
              />
              <div className="w-[576px] bg-black h-0.5"></div>
              <p className="text-[20px] text-[#898989] mt-10 ml-5">Card Holder</p>
              <input 
                type="text" 
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-[576px] h-[33px] px-5 mt-3 focus:outline-none text-[20px] focus:ring-0 focus:border-none"
              />
              <div className="w-[576px] bg-black h-0.5"></div>
              <p className="text-[20px] text-[#898989] mt-10 ml-5">Expired Date</p>
              <input 
                value={expiry} 
                onChange={handleChangedate} 
                className="w-[576px] h-[33px] px-5 mt-3 focus:outline-none text-[20px] focus:ring-0 focus:border-none"
              />
              <div className="w-[257px] bg-black h-0.5"></div>
              <p className="mt-10 ml-2 text-[16px] text-[#898989]">Email</p>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[570px] border mt-5 ml-2 h-[56px] px-5"
              />
              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 ml-2 rounded-full accent-[#009B62] border border-gray-400 mt-1"
                />
                <label className="text-sm leading-tight mt-1">
                  By clicking place order you agree to the{' '}
                  <span className="underline text-[#009B62] text-[12px]">
                    Terms & Conditions
                  </span>
                </label>
              </div>
              <div className="flex justify-between items-center ml-1 mt-5">
                <div className="flex gap-2">
                  <input type="checkbox" className="w-[29px] h-[31px] border border-black" />
                  <p>Save Card</p>
                </div>
                <button 
                  onClick={() => createPayment("card", {
                    cardNumber: value.replace(/\s/g, ''),
                    cardHolder,
                    expiryDate: expiry,
                    email
                  })}
                  disabled={!value || !cardHolder || !expiry || !email}
                  className="border w-[170px] h-[50px] bg-emerald-400 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed Payment
                </button>
              </div>
            </div>
          </div>
        );

      case "crypto":
        return (
          <div className="flex gap-5">
            {/* Left Panel - Payment Display */}
            <div className="w-[879px] min-h-[1142px] border flex flex-col gap-2 p-5">
              {!binanceData ? (
                <>
                  {/* Selected Crypto Header */}
                  <div className="flex justify-center items-center w-full">
                    <Image
                      src={`/assets/payment/crypto/${selectedCrypto}.png`}
                      alt={selectedCrypto}
                      width={93}
                      height={63}
                    />
                    <h2 className="text-[64px] italic capitalize">{selectedCrypto}</h2>
                  </div>

                  <div className="w-[80%] h-[8px] bg-[#FFBB00] ml-20 mt-5"></div>

                  {/* Warning Message */}
                  <div className="w-[80%] h-auto bg-[#FFF1D3] flex px-5 py-5 gap-2 ml-20 rounded-lg">
                    <span className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-white text-[#FFD044] font-bold flex-shrink-0">
                      !
                    </span>
                    <p className="text-[14px]">
                      You will be redirected to Binance Pay to complete your payment securely.
                      Binance Pay supports multiple cryptocurrencies and provides instant
                      confirmation.
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="flex flex-col items-center mt-10 gap-5">
                    <div className="bg-gray-50 p-6 rounded-lg border w-[80%]">
                      <p className="text-[24px] font-semibold mb-4 text-center">
                        Pay with Binance
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Selected Currency:</span>
                        <span className="text-[20px] font-bold text-blue-600">
                          {cryptoCurrencyMap[selectedCrypto]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Order Amount:</span>
                        <span className="text-[20px] font-bold text-blue-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded mt-4">
                        <p className="text-[12px] text-gray-600 text-center">
                          Final amount will be calculated based on current exchange rate
                        </p>
                      </div>
                    </div>

                    {/* Binance Logo */}
                    <div className="flex items-center gap-3 mt-5">
                      <div className="w-[80px] h-[80px] bg-[#F3BA2F] rounded-full flex items-center justify-center">
                        <span className="text-white text-[40px] font-bold">B</span>
                      </div>
                      <div>
                        <p className="text-[32px] font-bold text-gray-800">Binance Pay</p>
                        <p className="text-[14px] text-gray-500">
                          Secure Cryptocurrency Payment
                        </p>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={() =>
                        handleBinancePayment(cryptoCurrencyMap[selectedCrypto])
                      }
                      disabled={binanceProcessing}
                      className="w-[300px] h-[68px] text-white bg-[#F3BA2F] hover:bg-[#d9a826] text-[20px] font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-5"
                    >
                      {binanceProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>Pay with Binance</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-[14px] text-center w-[80%] text-gray-500 mt-3">
                      By proceeding, you'll be redirected to Binance Pay to complete your
                      payment securely
                    </p>
                  </div>
                </>
              ) : (
                /* Show QR Code if available */
                <div className="flex flex-col justify-center items-center py-10 gap-5">
                  <h3 className="text-[32px] font-bold">Scan to Pay</h3>
                  
                  {binanceData.qrContent && (
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                      <img
                        src={binanceData.qrcodeLink}
                        alt="Binance QR Code"
                        className="w-[367px] h-[367px]"
                      />
                    </div>
                  )}

                  <p className="text-[18px] text-center w-[80%]">
                    Scan this QR code with your Binance app to complete the payment
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (binanceData.checkoutUrl) {
                          window.location.href = binanceData.checkoutUrl;
                        }
                      }}
                      className="px-6 py-3 bg-[#F3BA2F] text-white rounded-lg hover:bg-[#d9a826] transition-colors"
                    >
                      Open in Binance
                    </button>
                    <button
                      onClick={() => setBinanceData(null)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-[80%] mt-5">
                    <p className="text-[14px] text-gray-700">
                      <strong>Order ID:</strong> {binanceData.binanceOrderId}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-2">
                      Payment expires at:{" "}
                      {new Date(binanceData.expireTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Crypto Selection */}
            <div className="border flex flex-col items-center w-[533.5px] h-[542px] p-5 gap-10">
              <p className="text-[32px] font-bold">Select Cryptocurrency</p>

              {/* Bitcoin */}
              <button
                onClick={() => setSelectedCrypto("bitcoin")}
                disabled={binanceProcessing}
                className={`w-[462px] h-[80px] skew-x-[-20deg] border-2 flex justify-center items-center transition-all hover:scale-105 ${
                  selectedCrypto === "bitcoin"
                    ? "border-[#F7931A] bg-orange-50"
                    : "border-gray-300 hover:border-[#F7931A]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/payment/crypto/bitcoin.png"
                    alt="bitcoin"
                    width={63}
                    height={63}
                    className="skew-x-[20deg]"
                  />
                  <div className="skew-x-[20deg]">
                    <p className="text-[30px] font-semibold">Bitcoin</p>
                    <p className="text-[14px] text-gray-500">BTC</p>
                  </div>
                </div>
              </button>

              {/* USDT */}
              <button
                onClick={() => setSelectedCrypto("usdt")}
                disabled={binanceProcessing}
                className={`w-[462px] h-[80px] skew-x-[-20deg] border-2 flex justify-center items-center transition-all hover:scale-105 ${
                  selectedCrypto === "usdt"
                    ? "border-[#26A17B] bg-green-50"
                    : "border-gray-300 hover:border-[#26A17B]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/payment/crypto/usdt.png"
                    alt="usdt"
                    width={63}
                    height={63}
                    className="skew-x-[20deg]"
                  />
                  <div className="skew-x-[20deg]">
                    <p className="text-[30px] font-semibold">Tether</p>
                    <p className="text-[14px] text-gray-500">USDT</p>
                  </div>
                </div>
              </button>

              {/* Solana */}
              <button
                onClick={() => setSelectedCrypto("solana")}
                disabled={binanceProcessing}
                className={`w-[462px] h-[80px] skew-x-[-20deg] border-2 flex justify-center items-center transition-all hover:scale-105 ${
                  selectedCrypto === "solana"
                    ? "border-[#14F195] bg-purple-50"
                    : "border-gray-300 hover:border-[#14F195]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/payment/crypto/solana.png"
                    alt="solana"
                    width={63}
                    height={63}
                    className="skew-x-[20deg]"
                  />
                  <div className="skew-x-[20deg]">
                    <p className="text-[30px] font-semibold">Solana</p>
                    <p className="text-[14px] text-gray-500">SOL</p>
                  </div>
                </div>
              </button>

              {/* BNB */}
              <button
                onClick={() => setSelectedCrypto("bnb")}
                disabled={binanceProcessing}
                className={`w-[462px] h-[80px] skew-x-[-20deg] border-2 flex justify-center items-center transition-all hover:scale-105 ${
                  selectedCrypto === "bnb"
                    ? "border-[#F3BA2F] bg-yellow-50"
                    : "border-gray-300 hover:border-[#F3BA2F]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/payment/crypto/bnb.png"
                    alt="bnb"
                    width={63}
                    height={63}
                    className="skew-x-[20deg]"
                  />
                  <div className="skew-x-[20deg]">
                    <p className="text-[30px] font-semibold">BNB</p>
                    <p className="text-[14px] text-gray-500">BNB</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case "other":
        return <div>📦 Other Payment Instructions</div>;

      default:
        return <p className="text-gray-500">Please choose a payment method.</p>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 mb-6">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`relative w-[119px] h-[30px] text-sm font-medium
              ${
                selectedMethod === method
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
          >
            {labels[method]}
            <span
              className={`
                absolute left-0 -bottom-1 h-[2px] bg-black
                transition-all duration-300 ease-in-out
                ${selectedMethod === method ? "w-full" : "w-0"}
              `}
            />
          </button>
        ))}
      </div>

      <div className="border-t pt-4">{renderContent()}</div>
    </div>
  );
};

export default PaymentPage;