'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // or use `next/router` if using pages dir

import { useEffect } from "react";
import {ForgotPassword} from "@/app/api/authService";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      await ForgotPassword(email);
      localStorage.setItem("resetEmail", email);
      router.push('/auth/forgetpassword/verification');
    }
    catch(err: any){
      setError(err.messsage)
    }

  };
    useEffect(() => {
      window.scrollTo(0, 0);
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
  
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY); // Restore scroll position
      };
    }, []);

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center">
        <div className="w-[1700px] h-[1380px] bg-transparent z-10 flex items-center justify-center ">
            <div className="w-[1440px] h-[850px] bg-white border mb-70 relative overflow-hidden">
                <div className="w-[733px] h-[840px] rounded-[25px] mt-10 ml-10 overflow-hidden absolute ">
                <Image
                    src="/assets/background-gradient-lights.jpg"
                    alt="bg-purple"
                    width={733}
                    height={1031}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="font-normal text-[40px] absolute top-1/6 right-1/5">Forget Password</div>
            <form onSubmit={handleSubmit} className="absolute right-1/15 top-1/3 w-[485px]">
                <p className="text-[14px]">Email</p>
                <Image src="/assets/Email.png" alt="email-icon" width={24} height={24} className="absolute right-[440px] top-[45px]"/>
                <input
                    type="email"
                    className="w-full h-[72px] border px-14 py-4 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && <p className="text-red-500 mb-2">{error}</p>}              
                    <button
                    type="submit"
                    className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px] cursor-pointer"
                    >
                    Send
                    </button>

                <Link href={"/auth/login"} className=" text-blue-600 text-center absolute right-[184px] mt-5">Back to login ⏎</Link>
            </form>
            </div>
        </div>
    </div>
  );
};

export default LoginForm;
