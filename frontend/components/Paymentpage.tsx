"use client";
import { useState } from "react";
import Image from "next/image";
type PaymentMethod = "local" | "paypal" | "card" | "crypto" | "other" | null;

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
    const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16); // digits only, max 16
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim(); // space every 4 digits
    setValue(formatted);
  };

  const [expiry, setExpiry] = useState('');

  const handleChangedate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '').slice(0, 4); // only numbers, max 4 digits
  
    // Validate month
    if (input.length >= 1) {
      const month = parseInt(input.slice(0, 2));
      if (month > 12) {
        input = '12' + input.slice(2); // force max month to 12
      }
    }
  
    if (input.length >= 3) {
      input = input.slice(0, 2) + '/' + input.slice(2); // add slash after MM
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
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#0F52BA] text-white">
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
            </div>
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#0C3471] text-white">
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
            </div>
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[40px] bg-[#E22528] text-white">
              <div className="flex justify-between items-center w-[90%] ">
                <Image
                  src="/assets/payment/canadia.png"
                  alt="canadia"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>Canadia Bank</span>
              </div>
            </div>
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#90B01A] text-white">
              <div className="flex justify-between items-center w-[80%] ">
                <Image
                  src="/assets/payment/wing.png"
                  alt="wing"
                  width={40}
                  height={40}
                  className="w-[72px] h-[72px]"
                />
                <span>Wing Bank</span>
              </div>
            </div>
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#F29616]">
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
            </div>
            <div className="w-[389px] h-[108px] border rounded-[20px] flex justify-center items-center font-bold text-[45px] bg-[#FF0105] text-white">
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
            </div>
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
              ></Image>
              <span className="text-white text-[45px] font-bold flex items-center ml-10">Pay<span className="text-[#00D0FF]">Pal</span></span>
            </div>
            <div>
              <p className="text-[20px] font-medium mt-10">YOUR VALID PAYPAL EMAIL</p>
              <div className="w-[1250px] flex justify-between items-center mt-3">
                <input type="email" className="w-[904px] h-[55px] border rounded-[25px] border-black px-10 text-[26px] "></input>
                <button className="w-[305px] h-[56px] border bg-[#244CFF] text-white text-[26px]">Proceeed</button>
              </div>
            </div>
          </div>
        );
      case "card":
        return <div className="flex py-40">
          <div className="flex flex-col gap-10">
            <div className="bg-gradient-to-b from-[#9C2CF3] to-[#3A49F9] w-[411px] h-[254px] rounded-[20px] relative overflow-hidden">
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -top-50 -right-60 bg-black opacity-[8%]"></div>
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -bottom-50 -left-60 bg-black opacity-[8%]"></div>
              <p className="absolute opacity-[54%] text-white text-[14px]  font-medium top-10 left-10">Current Balance</p>
              <p className="absolute text-white font-medium text-[28px] left-10 top-17">$5,750,20</p>
              <div className="absolute text-[14px] font-medium text-white left-10 bottom-8">5282 3456 7890 1289</div>
              <div className="absolute text-[14px] font-medium text-white right-10 bottom-8">09/25</div>
              <div className="absolute right-5 top-5">
                <Image src="/assets/payment/mastercard.png" alt="mastercard" width={100} height={100} className="w-[105px] h-[69px] "></Image>
                <p className="text-[12px] text-white absolute top-14 right-6">mastercard</p>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#f32c2c] to-[#af7f1f] w-[411px] h-[254px] rounded-[20px] relative overflow-hidden">
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -top-50 -right-60 bg-black opacity-[8%]"></div>
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -bottom-50 -left-60 bg-black opacity-[8%]"></div>
              <p className="absolute opacity-[54%] text-white text-[14px]  font-medium top-10 left-10">Current Balance</p>
              <p className="absolute text-white font-medium text-[28px] left-10 top-17">$5,750,20</p>
              <div className="absolute text-[14px] font-medium text-white left-10 bottom-8">5282 3456 7890 1289</div>
              <div className="absolute text-[14px] font-medium text-white right-10 bottom-8">09/25</div>
              <div className="absolute right-5 top-5">
                <Image src="/assets/payment/visa.png" alt="mastercard" width={100} height={100} className="w-[105px] h-[69px] "></Image>
              </div>
            </div>
            <div className="bg-[#979797] w-[411px] h-[254px] rounded-[20px] border-black border-2 relative overflow-hidden flex items-center justify-center">
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -top-50 -right-60 bg-black opacity-[8%]"></div>
              <div className="w-[469px] h-[312px] rounded-[50%] border absolute -bottom-50 -left-60 bg-black opacity-[8%]"></div>
              <p className="px-2">Add New</p>
              <div className="w-[30px] h-[30px] bg-black rounded-full text-white flex justify-center items-center text-[30px]"><span className="mb-1">+</span></div>

            </div>
            
          </div>
          <div className="w-[679px] h-[817px] px-20 py-10 ml-50 border">
            <p className="text-[20px]">Pay using Credit Card</p>
            <div className="relative">
              <Image src="/assets/payment/mastercard.png" alt="mastercard" width={100} height={100} className="w-[132px] h-[76px]"></Image>
              <p className="text-black ml-7 absolute top-15">mastercard</p>
            </div>
            <p className="text-[20px] text-[#898989] mt-10 ml-5 ">Credit card</p>
            <input value={value} onChange={handleChange} className="w-[576px] h-[33px] px-5 mt-3  focus:outline-none text-[20px] focus:ring-0 focus:border-none "></input>
            <div className="w-[576px] bg-black h-0.5"></div>
            <p className="text-[20px] text-[#898989] mt-10 ml-5 ">Card Holder</p>
            <input type="text" className="w-[576px] h-[33px] px-5 mt-3  focus:outline-none text-[20px] focus:ring-0 focus:border-none "></input>
            <div className="w-[576px] bg-black h-0.5"></div>
            <p className="text-[20px] text-[#898989] mt-10 ml-5 ">Expired Date</p>
            <input value={expiry} onChange={handleChangedate} className="w-[576px] h-[33px] px-5 mt-3  focus:outline-none text-[20px] focus:ring-0 focus:border-none "></input>
            <div className="w-[257px] bg-black h-0.5"></div>
            <p className="mt-10 ml-2 text-[16px] text-[#898989]">Email</p>
            <input type="email" className="w-[570px] border mt-5 ml-2 h-[56px] px-5"></input>
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
              <div className="flex gap-2 ">
                <input type="checkbox" className="w-[29px] h-[31px] border border-black"></input>
                <p>Save Card</p>
              </div>
              <button className="border w-[170px] h-[50px] bg-emerald-400 text-white">Proceed Payment</button>
            </div>
          </div>
        </div>
      case "crypto":
        return <div className="flex gap-5">
          <div className="w-[879px] h-[1142px] border flex flex-col gap-2">
            <div className="flex justify-center items-center w-full">
              <Image src="/assets/payment/crypto/bitcoin.png" alt="bitcoin" width={93} height={63}></Image>
              <h2 className="text-[64px] italic">bitcoin</h2>
            </div>
            <div className="w-[80%] h-[8px] bg-[#FFBB00] ml-20 mt-5"></div>
            <div className="w-[80%] h-[122px] bg-[#FFF1D3] flex px-15 py-5 gap-2 ml-20">
              <span className="w-[30px] h-[18px] rounded-full flex justify-center items-center bg-white text-[#FFD044]">!</span>
              <p className="text-[14px]">Dont change the Bitcoin wallet address or install external plugins. Any changes to the payment process may prevent your payment from reaching the seller. As a result, you may lose your money </p>
            </div>
            
            <p className="text-[32px] text-[#8B8181] flex justify-center items-center">BTC amount</p>
            <p className="text-[32px] flex justify-center items-center mt-2">0.00000452 BTC</p>
            <p className="text-[32px] text-[#8B8181] flex justify-center items-center mt-2">BTC address</p>
            <p className="text-black text-[24px] flex justify-center items-center mt-2">bc1q8cxwu33dhasuemkmrl8unp2r5npt7qtzk0ecfz</p>
            <div className="flex justify-center items-center mt-4">
              <Image src="/assets/payment/crypto/copy.png" alt="copy" width={34} height={48}></Image>
              <p className="text-[#009DFF] text-[24px]">Copy</p>
            </div>
            <div className="flex flex-col justify-center items-center mt-5 gap-5">
              <Image src="/assets/payment/crypto/qrcode.png" alt="qrcode" width={367} height={367}></Image>
              <p className="text-[24px] text-center w-[80%] ">Scan the code or copy the address to pay for your order Then confirm your payment to continue</p>
              <button className="w-[225px] h-[68px] text-white bg-[#008EFA] text-[20px] font-bold">Confirm Payment</button>
            </div>
          </div>
          <div className="border flex flex-col items-center w-[533.5px] h-[542px] p-5 gap-10">
            <p className="text-[32px] ">Select Cryptocurrentcy</p>
            <div className="w-[462px] h-[80px] skew-x-[-20deg] border flex justify-center items-center">
              <div className="flex items-center gap-3">
                <Image src="/assets/payment/crypto/bitcoin.png" alt="bitcoin" width={63} height={63} className="skew-x-[20deg]"></Image>
                <p className="text-[30px]">bitcoin</p>
              </div>
            </div>
            <div className="w-[462px] h-[80px] skew-x-[-20deg] border flex justify-center items-center">
              <div className="flex items-center gap-3">
                <Image src="/assets/payment/crypto/usdt.png" alt="bitcoin" width={63} height={63} className="skew-x-[20deg]"></Image>
                <p className="text-[30px]">Usdt</p>
              </div>
            </div>
            <div className="w-[462px] h-[80px] skew-x-[-20deg] border flex justify-center items-center">
              <div className="flex items-center gap-3">
                <Image src="/assets/payment/crypto/solana.png" alt="bitcoin" width={63} height={63} className="skew-x-[20deg]"></Image>
                <p className="text-[30px]">Solana</p>
              </div>
            </div>
            <div className="w-[462px] h-[80px] skew-x-[-20deg] border flex justify-center items-center">
              <div className="flex items-center gap-3">
                <Image src="/assets/payment/crypto/bnb.png" alt="bitcoin" width={63} height={63} className="skew-x-[20deg]"></Image>
                <p className="text-[30px]">BNB</p>
              </div>
            </div>
          </div>

            
        </div>;
      case "other":
        return <div>📦 Other Payment Instructions</div>;
      default:
        return <p className="text-gray-500">Please choose a payment method.</p>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 mb-6 ">
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
            {/* Underline */}
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
