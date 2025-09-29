'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // or use `next/router` if using pages dir
import { loginUser } from "@/app/api/authService";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      const {token} = await loginUser(email, password)
      localStorage.setItem('token', token)
      window.location.href= '/';
    }
    catch(err: any){
      setError(err.messsage)
    }
  };

  return (
    <div className="w-[1700px] h-[1380px] bg-white z-10 flex items-center justify-center">
      <div className="w-[1440px] h-[850px] border mb-70 relative">
        <div className="w-[733px] h-[840px] rounded-[25px] mt-10 ml-10 overflow-hidden absolute ">
          <Image
            src="/assets/background-gradient-lights.jpg"
            alt="bg-purple"
            width={733}
            height={1031}
            className="object-cover w-full h-full "
          />
        </div>
        <div className="font-normal text-[40px] absolute top-1/6 right-1/3">
          Login
        </div>
        <form onSubmit={handleSubmit} className="absolute right-1/15 top-1/3 w-[485px]">
          <p className="text-[14px]">Email</p>
          <input
            type="email"
            className="w-full h-[72px] border p-4 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="text-[14px]">Password</p>
          <input
            type="password"
            className="w-full h-[72px] border p-4 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center gap-3 mb-4">
            <input type="checkbox" className="w-[20px] h-[20px] border" />
            <p className="text-[14px]">Remember me</p>
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px]"
          >
            Login
          </button>
        </form>

        <p className="absolute right-1/14 top-[500px]">Forgot Password</p>

        <span className="w-[122px] h-0.5 bg-black absolute right-[370px] top-[745px]"></span>
        <p className="absolute right-[245px] top-[645px] text-[14px]">
          <Link href="/auth/signup">
            <span className="underline">{`Don't have an account?`}</span>
          </Link>
          <Link href="/auth/signup">
            <span className="text-blue-500 cursor-pointer ml-2">Sign Up</span>
          </Link>
        </p>
        <p className="absolute right-[320px] top-[732px]">or</p>
        <span className="w-[122px] h-0.5 bg-black absolute right-[160px] top-[745px]"></span>
        <div className="w-[491px] h-[90px] right-[90px] top-[740px] absolute flex flex-wrap mt-4">
          <div className="w-1/3">
            <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2"><span><Image src="/Icon/googlec.png" alt="google" width={20} height={20}></Image></span>Google</div>
          </div>
          <div className="w-1/3">
            <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2"><span><Image src="/Icon/facebookc.png" alt="facebook" width={20} height={20}></Image></span>Facebook</div>
          </div>
          <div className="w-1/3">
            <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2"><span><Image src="/Icon/telegramc.png" alt="telegram" width={20} height={20}></Image></span>Telegram</div>
          </div>
          <div className="w-1/3 ml-15">
            <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2"><span><Image src="/Icon/twitterc.png" alt="twitter" width={20} height={20}></Image></span>Twitter</div>
          </div>
          <div className="w-1/2">
            <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2"><span><Image src="/Icon/phonec.png" alt="phone" width={20} height={20}></Image></span>Phone</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
