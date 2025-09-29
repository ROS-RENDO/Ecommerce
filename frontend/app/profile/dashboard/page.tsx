import React from 'react'
import Image from 'next/image'
const page = () => {
  return (
    <div className='px-20'>
        <div className='w-full h-[120px] flex justify-center items-center'>
            <div className="w-[405px] h-[33px] bg-[#3C215F] rounded-3xl relative">
              <h1 className="text-[16px] font-light text-white flex justify-center items-center mt-1 tracking-[0.20em]">
                DASHBOARD
              </h1>
            </div>
        </div>
        <h1 className='text-[32px] ml-5 '>Welcome back, Ros Rendo!</h1>
        <p className='text-[15px] ml-5'>Here is what happening in your order</p>
        <div className='w-full h-0.5 bg-black mt-5'></div>
        <div className='flex mt-10 justify-between '>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Total Orders</h1>
                <p className='text-[36px]'>3</p>
                <p className='text-[12px]'>All time order</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#DBEAFE] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/box.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Pending Orders</h1>
                <p className='text-[36px]'>18</p>
                <p className='text-[12px]'>Await Processing</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#FEF9C3] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/time.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Completed Orders</h1>
                <p className='text-[36px]'>199</p>
                <p className='text-[12px]'>Successful Delivered</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#DCFCE7] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/tick.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
            <div className='w-[284px] h-[140px] border px-5 py-5 relative'>
                <h1 className='text-[15px] text-[#757575]'>Total Spent</h1>
                <p className='text-[36px]'>$2847.99</p>
                <p className='text-[12px]'>$547.12 this month</p>
                <div className='w-[48px] h-[48px] rounded-full bg-[#F3E8FF] absolute right-0 top-0 flex justify-center items-center mr-2 mt-2'>

                  <Image src="/Icon/box.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                </div>
            </div>
        </div>
        <div className='flex py-10'>
          
          <div className='ml-30'>
            <div className='w-[928px] h-[72px] border flex justify-start items-center px-5 gap-2'>
              <Image src="/Icon/box.png" alt='box' width={16} height={16} className='w-[16px] h-[16px]'></Image>
              <h1 className='text-[20px] font-semibold'>Recent Activity</h1>
            </div>
            <div className='w-[928px] h-[1115px] border flex flex-col justify-start items-center gap-y-8'>
              <div className='flex flex-col mt-10'>
                <div className='w-[750px] h-[153px] border rounded-t-[15px] relative px-5 py-1 '>
                    <div className='flex justify-between'>
                      <div className='w-[48px] h-[48px] rounded-full bg-[#DBEAFE] absolute left-2 top-2 flex justify-center items-center '>
                        <Image src="/Icon/box.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                      </div>
                      <p className='text-[20px] ml-12 py-4'>Order #ORD-001 placed</p>
                      <div className='w-[84px] h-[21px] flex justify-center items-center bg-[#DBEAFE] rounded-[20px] mt-4'>
                        <p className='text-[13px]'>Processing</p>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-[64px] h-[64px] bg-[#D9D9D9]'></div>
                      <div className='px-5'>
                        <p className='font-bold'>Premium Wireless Headphone</p>
                        <p className='text-[13px] font-medium'>Total: $199.10  (2 items) </p>
                        <p className='text-[13px] text-[#737373]'>2 hours ago</p>
                      </div>
                    </div>
                </div>
                <div className='w-[750px] h-[68px] border rounded-b-[15px] flex justify-end items-center px-5 bg-[#DFE0EC]'>
                  <div className='w-[127px] h-[36px] bg-[#EEF1F6] flex justify-center items-center'>{'View detail >'}</div>
                </div>
              </div>
              <div className='flex flex-col '>
                <div className='w-[750px] h-[153px] border rounded-t-[15px] relative px-5 py-1 '>
                    <div className='flex justify-between'>
                      <div className='w-[48px] h-[48px] rounded-full bg-[#FEF9C3] absolute left-2 top-2 flex justify-center items-center '>
                        <Image src="/Icon/time.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                      </div>
                      <p className='text-[20px] ml-12 py-4'>Order #ORD-001 shipped</p>
                      <div className='w-[84px] h-[21px] flex justify-center items-center bg-[#FEF9C3] rounded-[20px] mt-4'>
                        <p className='text-[13px]'>Shipped</p>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-[64px] h-[64px] bg-[#D9D9D9]'></div>
                      <div className='px-5'>
                        <p className='font-bold'>Premium Wireless Headphone</p>
                        <p className='text-[13px] font-medium'>Total: $199.10  (2 items) </p>
                        <p className='text-[13px] text-[#737373]'>2 hours ago</p>
                      </div>
                    </div>
                </div>
                <div className='w-[750px] h-[68px] border rounded-b-[15px] flex justify-end items-center px-5 bg-[#DFE0EC]'>
                  <div className='w-[127px] h-[36px] bg-[#EEF1F6] flex justify-center items-center'>{'View detail >'}</div>
                </div>
              </div>
              <div className='flex flex-col '>
                <div className='w-[750px] h-[153px] border rounded-t-[15px] relative px-5 py-1 '>
                    <div className='flex justify-between'>
                      <div className='w-[48px] h-[48px] rounded-full bg-[#DCFCE7] absolute left-2 top-2 flex justify-center items-center '>
                        <Image src="/Icon/tick.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                      </div>
                      <p className='text-[20px] ml-12 py-4'>Order #ORD-001 placed</p>
                      <div className='w-[84px] h-[21px] flex justify-center items-center bg-[#DCFCE7] rounded-[20px] mt-4'>
                        <p className='text-[13px]'>Delivered</p>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-[64px] h-[64px] bg-[#D9D9D9]'></div>
                      <div className='px-5'>
                        <p className='font-bold'>Premium Wireless Headphone</p>
                        <p className='text-[13px] font-medium'>Total: $199.10  (2 items) </p>
                        <p className='text-[13px] text-[#737373]'>2 hours ago</p>
                      </div>
                    </div>
                </div>
                <div className='w-[750px] h-[68px] border rounded-b-[15px] flex justify-end items-center px-5 bg-[#DFE0EC]'>
                  <div className='w-[127px] h-[36px] bg-[#EEF1F6] flex justify-center items-center'>{'View detail >'}</div>
                </div>
              </div>
              <div className='flex flex-col '>
                <div className='w-[750px] h-[153px] border rounded-t-[15px] relative px-5 py-1 '>
                    <div className='flex justify-between'>
                      <div className='w-[48px] h-[48px] rounded-full bg-[#white] border absolute left-2 top-2 flex justify-center items-center '>
                        <Image src="/Icon/eye.png" alt='box' width={20} height={20} className='w-[20px] h-[20px]'></Image>
                      </div>
                      <p className='text-[20px] ml-12 py-4'>Order #ORD-001 placed</p>
                      <div className='w-[84px] h-[21px] flex justify-center items-center bg-[#f4f4f4] rounded-[20px] mt-4'>
                        <p className='text-[13px]'>Pending</p>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-[64px] h-[64px] bg-[#D9D9D9]'></div>
                      <div className='px-5'>
                        <p className='font-bold'>Premium Wireless Headphone</p>
                        <p className='text-[13px] font-medium'>Total: $199.10  (2 items) </p>
                        <p className='text-[13px] text-[#737373]'>2 hours ago</p>
                      </div>
                    </div>
                </div>
                <div className='w-[750px] h-[68px] border rounded-b-[15px] flex justify-end items-center px-5 bg-[#DFE0EC]'>
                  <div className='w-[127px] h-[36px] bg-[#EEF1F6] flex justify-center items-center'>{'View detail >'}</div>
                </div>
              </div>
              <div className='w-[135px] h-[40px] border text-[13px] flex justify-center items-center mb-5'>View All Activity</div>
            </div>
          </div>
          <div className='border w-[390px] h-[347px] rounded-[10px] px-5 py-5 ml-50'>
            <p className='text-[24px]'>Quick Actions</p>
            <div className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#3B82F6]'>
                <Image src="/Icon/cartwhite.png" alt='cart white' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Browse Products</p>
                <p className='text-[12px] text-[#676767]'>Discover new items</p>
              </div>
            </div>
            <div className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#22C55E]'>
                <Image src="/Icon/boxwhite.png" alt='box white' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Order History</p>
                <p className='text-[12px] text-[#676767]'>View all orders</p>
              </div>
            </div>
            <div className='w-[334px] h-[73px] border ml-2 mt-4 rounded-[10px] flex items-center px-5'>
              <div className='w-[32px] h-[32px] border flex justify-center items-center bg-[#A855F7]'>
                <Image src="/Icon/setting.png" alt='setting' width={21} height={21}></Image>
              </div>
              <div className='px-3'>
                <p className='text-[16px]'>Account Settings</p>
                <p className='text-[12px] text-[#676767]'>Manage your account</p>
              </div>
            </div>
    

          </div>
        </div>
    </div>
  )
}

export default page