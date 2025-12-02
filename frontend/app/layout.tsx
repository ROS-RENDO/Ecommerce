"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ChatSupportButton from "@/components/ChatSupportButton ";
import { getProfile } from "@/app/api/profileService";
import AuthWrapper from "@/context/AuthContext"; // Your existing AuthWrapper

interface LayoutContentProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | undefined>();

  // Fetch user ID after component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const currentUser = await getProfile();
        if (currentUser) setUserId(currentUser._id || currentUser.id);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserId();
  }, []);

  // Determine routes where header/footer should be hidden
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgetpassword") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.endsWith("/profile") ||
    pathname?.endsWith("/chat");

  const shouldExcludeLayout = isAdminRoute || isAuthRoute;

  return (
    <>
      {shouldExcludeLayout ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen flex flex-col">
          <header className="flex justify-center">
            <Header />
          </header>

          <main className="flex-grow">{children}</main>

          {/* Show chat support only when userId exists */}
          {userId && <ChatSupportButton userId={userId} userRole="customer" />}

          <Footer />
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <LayoutContent>{children}</LayoutContent>
        </AuthWrapper>
      </body>
    </html>
  );
}
