"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [email, setEmail] = useState(emailFromParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
        { email, code },
        { withCredentials: true }
      );

      setSuccess(response.data.message);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
        { email }
      );

      setSuccess(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center">
      <div className="w-full max-w-[600px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to your email address.
            <br />
            Please enter it below to verify your account.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full h-12 border rounded-md px-4 bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              readOnly={!!emailFromParams}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <input
              type="text"
              className="w-full h-12 border rounded-md px-4 text-center text-2xl tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the 6-digit code from your email
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#3C215F] text-white h-12 rounded-md hover:bg-[#2d1847] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:underline text-sm font-medium disabled:opacity-50"
            disabled={resendLoading}
          >
            {resendLoading ? "Sending..." : "Resend Verification Code"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/auth/login")}
            className="text-gray-600 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}