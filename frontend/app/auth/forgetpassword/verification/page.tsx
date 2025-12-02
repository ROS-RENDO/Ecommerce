"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const VerificationForm = () => {
  const [values, setValues] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (val: string, i: number) => {
    if (/^[0-9]?$/.test(val)) {
      const newValues = [...values];
      newValues[i] = val;
      setValues(newValues);

      if (val && i < 3) {
        inputs.current[i + 1]?.focus(); // move to next input
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      inputs.current[i - 1]?.focus(); // go back
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = values.join(""); // combine digits into "1234"
    const email = localStorage.getItem("resetEmail"); // stored in Forget Password

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Code verified successfully");
      localStorage.setItem("resetCode", code);
      router.push("/auth/forgetpassword/resetpassword");
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

          <div className="font-normal text-[40px] absolute top-1/6 right-1/4">
            Verification
          </div>

          <form
            onSubmit={handleSubmit}
            className="absolute right-1/15 top-1/3 w-[485px]"
          >
            <p className="text-[18px] mb-4">Passcode</p>
            <div className="flex gap-6 mb-6">
              {values.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-14 text-center border rounded-lg text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="flex justify-center items-center bg-[#3C215F] w-full h-[50px] rounded-[12px] text-white text-[14px] cursor-pointer mt-5"
            >
              Verify Code
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

export default VerificationForm;
