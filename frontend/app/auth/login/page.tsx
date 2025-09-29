"use client";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";

export default function LoginPage() {
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
    <div className="w-full h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
