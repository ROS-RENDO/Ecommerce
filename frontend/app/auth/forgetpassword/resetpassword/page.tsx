"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResetPassword } from "@/app/api/authService";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail"); // saved earlier
    const code = localStorage.getItem("resetCode");   // saved from verification
    if (!email || !code) {
      setError("Missing email or verification code. Please restart process.");
      return;
    }
    

    try {
      console.log("Calling ResetPassword with", { email, code, newPassword, confirmPassword });
      await ResetPassword(email, code, newPassword, confirmPassword);
      alert("✅ Password reset successfully!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[url('/assets/backgroundauth.png')] flex items-center justify-center">
      <div className="w-[1700px] h-[1380px] bg-transparent z-10 flex items-center justify-center">
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

          <div className="font-normal text-[40px] absolute top-1/6 right-1/5">
            Reset Password
          </div>

          <form
            onSubmit={handleSubmit}
            className="absolute right-1/15 top-1/3 w-[485px]"
          >
            <p className="text-[14px]">New Password</p>
            <input
              type="password"
              className="w-full h-[72px] border px-4 py-4 mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <p className="text-[14px]">Confirm Password</p>
            <input
              type="password"
              className="w-full h-[72px] border px-4 py-4 mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px] cursor-pointer"
            >
              Reset Password
            </button>

            <Link
              href={"/auth/login"}
              className=" text-blue-600 text-center absolute right-[184px] mt-5"
            >
              Back to login ⏎
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
