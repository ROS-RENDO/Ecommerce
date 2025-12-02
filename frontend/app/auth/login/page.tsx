"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/api/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password, rememberMe);
      
      console.log("Login successful:", data); // Debug log
      
      // Successful login
      window.location.href = "/";
    } catch (err: any) {
      console.log("Login error:", err); // Debug log
      console.log("Error status:", err.status); // Debug log
      console.log("Requires verification:", err.requiresVerification); // Debug log
      
      // Check if email verification is required (403 status)
      if (err.status === 403 || err.requiresVerification === true) {
        console.log("Redirecting to verification page"); // Debug log
        
        // Store email for verification page
        const userEmail = err.email || email;
        if (typeof window !== 'undefined') {
          localStorage.setItem('verificationEmail', userEmail);
          console.log("Stored email in localStorage:", userEmail); // Debug log
        }
        
        // Redirect to verification page
        router.push(`/auth/login/verify-email?email=${encodeURIComponent(userEmail)}`);
        return;
      }
      
      // Check if user should use Google login instead
      if (err.authProvider === "google" || err.message?.includes("Google")) {
        setError(
          "This account was created with Google. Please click the 'Google' button below to login."
        );
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google login
    window.location.href = `http://localhost:5000/api/auth/google`;
  };

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center overflow-y-hidden md:max-h-svh ">
      <div className="w-full max-w-[1700px] h-[1380px] bg-transparent z-10 flex items-center justify-center  ">
        <div className="w-full max-w-[1440px] h-[850px] bg-white border relative overflow-hidden">
          <div className="hidden md:block md:w-1/2 lg:w-[733px] min-h-[840px] rounded-[25px] mt-10 ml-10 overflow-hidden absolute  ">
            <Image
              src="/assets/background-gradient-lights.jpg"
              alt="bg-purple"
              width={733}
              height={1031}
              className="object-cover w-full h-full "
            />
          </div>
          <div className="font-normal text-[40px] absolute top-1/6 right-1/3 ">
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
              <input 
                type="checkbox" 
                className="w-[20px] h-[20px] border cursor-pointer" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
              />
              <p className="text-[14px]">Remember me</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-[14px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <Link href="/auth/forgetpassword" className="absolute right-1/14 top-[500px] cursor-pointer text-[14px] hover:text-blue-500">
            Forgot Password
          </Link>

          <span className="w-[122px] h-0.5 bg-black absolute right-[370px] top-[745px]"></span>
          <p className="absolute right-[245px] top-[645px] text-[14px]">
            <Link href="/auth/register">
              <span className="underline">{`Don't have an account?`}</span>
            </Link>
            <Link href="/auth/register">
              <span className="text-blue-500 cursor-pointer ml-2">Sign Up</span>
            </Link>
          </p>
          <p className="absolute right-[320px] top-[732px]">or</p>
          <span className="w-[122px] h-0.5 bg-black absolute right-[160px] top-[745px]"></span>
          <div className="w-[491px] h-[90px] right-[90px] top-[740px] absolute flex flex-wrap mt-4">
            <div className="w-1/3">
              <button 
                onClick={handleGoogleLogin} 
                type="button"
                className="cursor-pointer w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span>
                  <Image src="/Icon/googlec.png" alt="google" width={20} height={20} />
                </span>
                Google
              </button>
            </div>
            <div className="w-1/3">
              <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 opacity-50 cursor-not-allowed">
                <span>
                  <Image src="/Icon/facebookc.png" alt="facebook" width={20} height={20} />
                </span>
                Facebook
              </div>
            </div>
            <div className="w-1/3">
              <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 opacity-50 cursor-not-allowed">
                <span>
                  <Image src="/Icon/telegramc.png" alt="telegram" width={20} height={20} />
                </span>
                Telegram
              </div>
            </div>
            <div className="w-1/3 ml-15">
              <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 opacity-50 cursor-not-allowed">
                <span>
                  <Image src="/Icon/twitterc.png" alt="twitter" width={20} height={20} />
                </span>
                Twitter
              </div>
            </div>
            <div className="w-1/2">
              <div className="w-[162px] h-[41px] rounded-[19px] border flex justify-center items-center gap-2 opacity-50 cursor-not-allowed">
                <span>
                  <Image src="/Icon/phonec.png" alt="phone" width={20} height={20} />
                </span>
                Phone
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}