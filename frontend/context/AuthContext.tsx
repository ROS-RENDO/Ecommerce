"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/app/api/profileService";
import CartLoader from "@/components/ui/Loading";

interface AuthWrapperProps {
  children: ReactNode;
  fallbackRedirect?: string; // where to redirect if not logged in
}

const AuthWrapper = ({ children, fallbackRedirect = "/auth/login" }: AuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const currentUser = await getProfile();
      if (!currentUser) {
        router.replace(fallbackRedirect);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router, fallbackRedirect]);

  if (loading) {
    return <CartLoader/>
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthWrapper;
