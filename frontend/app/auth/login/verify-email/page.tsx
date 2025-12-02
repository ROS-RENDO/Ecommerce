"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail, resendVerificationCode } from "@/app/api/authService";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL query params or localStorage
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('verificationEmail') : null;
    
    const userEmail = emailFromUrl || emailFromStorage || "";
    setEmail(userEmail);

    // If no email is found, redirect to login
    if (!userEmail) {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Countdown timer for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await verifyEmail(email, code);
      
      setSuccess(data.message || "Email verified successfully!");
      
      // Clear stored email
      if (typeof window !== 'undefined') {
        localStorage.removeItem('verificationEmail');
      }
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await resendVerificationCode(email);
      setSuccess(data.message || "Verification code has been resent to your email");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center overflow-y-hidden md:max-h-svh">
      <div className="w-full max-w-[1700px] h-[1380px] bg-transparent z-10 flex items-center justify-center">
        <div className="w-full max-w-[1440px] h-[850px] bg-white border relative overflow-hidden">
          <div className="hidden md:block md:w-1/2 lg:w-[733px] min-h-[840px] rounded-[25px] mt-10 ml-10 overflow-hidden absolute">
            <Image
              src="/assets/background-gradient-lights.jpg"
              alt="bg-purple"
              width={733}
              height={1031}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute right-1/15 top-1/5 w-[485px]">
            <h1 className="font-normal text-[40px] mb-4">Verify Your Email</h1>
            <p className="text-[14px] text-gray-600 mb-8">
              We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>. 
              Please enter it below to verify your account.
            </p>

            <form onSubmit={handleSubmit}>
              <p className="text-[14px] mb-2">Verification Code</p>
              <input
                type="text"
                className="w-full h-[72px] border p-4 mb-4 text-center text-[24px] tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-[14px]">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-[14px]">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="flex items-center justify-between text-[14px] mt-6">
              <p className="text-gray-600">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading || resendCooldown > 0}
                className="text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </div>

            <div className="mt-8 text-center">
              <Link href="/auth/login" className="text-[14px] text-gray-600 hover:text-gray-800">
                ← Back to Login
              </Link>
            </div>

            <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded text-[12px] text-gray-700">
              <p className="font-semibold mb-2">📧 Email Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spam or junk folder</li>
                <li>The code expires in 15 minutes</li>
                <li>Make sure you entered the correct email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}