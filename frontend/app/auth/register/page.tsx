"use client";
import React, { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { registerUser } from "@/app/api/authService";
import { useRouter } from "next/navigation";


export default function SignupPage() {
   const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router= useRouter()
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");
  
      // Simple validation example
      if (!firstName|| !lastName ||!email || !password || !username) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!username.startsWith("@")){
        setError("Username must start with '@'.")
        return;
      }
      try {
        await registerUser(firstName, lastName, username, email, password)
        setSuccess('Registration successful!')
        setError('')
        router.push(`/auth/register/verify-email?email=${encodeURIComponent(email)}`);
      } catch (err: any) {
        setError(err.message);
        setSuccess('')
      }
    };

    const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center overflow-y-hidden md:max-h-svh  ">
      <div className="w-full max-w-[1700px] h-[1380px] bg-transparent z-10 flex items-center justify-center">
      <div className="w-full max-w-[1440px] h-[850px] border bg-white relative overflow-hidden">
        <div className="w-[733px] h-[840px] rounded-[25px] mt-10 ml-10 overflow-hidden absolute ">
          <Image
            src="/assets/background-gradient-lights.jpg"
            alt="bg-purple"
            width={733}
            height={1031}
            className="object-cover w-full h-full "
          />
        </div>

        <div className="font-normal text-[40px] absolute top-1/6 right-[440px]">
          Register
        </div>

        <form onSubmit={handleSubmit} className="absolute right-1/4 top-55 space-y-6">
          <div>
            <p className="text-[14px]">First Name</p>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-[211px] h-[68px] border p-4"
            />
          </div>

          <div className="absolute left-68 top-0">
            <p className="text-[14px]">Last Name</p>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-[211px] h-[68px] border p-4"
            />
          </div>

          <div className="absolute top-25">
            <p className="text-[14px]">Username</p>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[485px] h-[72px] border p-4"
            />
          </div>

          <div className="absolute top-50">
            <p className="text-[14px]">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[485px] h-[72px] border p-4"
            />
          </div>

          <div className="absolute top-80">
            <p className="text-[14px]">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[485px] h-[72px] border p-4"
            />
          </div>

          <button type="submit" className="flex justify-center items-center bg-[#3C215F] w-[485px] h-[50px] rounded-[12px] text-white absolute top-105 text-[14px] cursor-pointer">
            Sign up
          </button>

          {error && <p className="text-red-600 absolute left-34 top-[-100px] text-nowrap">{error}</p>}

          {success && <p className="text-green-600 absolute left-34 top-[-100px] text-nowrap">{success}</p>}
        </form>

        <p className="absolute right-[245px] top-[700px] text-[14px]">
          <Link href="/auth/login">
            <span className="underline cursor-pointer">Already have account?</span>
          </Link>
          <Link href="/auth/login">
            <span className="text-blue-500 ml-2 cursor-pointer">Login</span>
          </Link>
        </p>
        <p className="absolute right-[245px] top-[700px] text-[14px]"><Link href="/auth/login"><span className="underline">Already have account?</span></Link><Link href="/auth/login"><span className="text-blue-500 ml-2 cursor-pointer">Login</span></Link> </p>
        <div className="flex relative">
          <span className="w-[122px] h-0.5 bg-black absolute right-[370px] top-[745px]"></span>
          <p className="absolute right-[320px] top-[732px]">or</p>
          <span className="w-[122px] h-0.5 bg-black absolute right-[160px] top-[745px]"></span>
        </div>
        <div className="w-[491px] h-[90px] right-[90px] top-[740px] absolute flex flex-wrap mt-4">
          <div className="w-1/3">
            <button onClick={handleGoogleSignup} className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 cursor-pointer"><span><Image src="/Icon/googlec.png" alt="google" width={20} height={20}></Image></span>Google</button>
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
    </div>
  );
}
