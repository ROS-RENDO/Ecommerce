"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Heart, User, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/api/authService";
import { fetchCart } from "@/app/api/CartService";
import { fetchWishlist } from "@/app/api/WishlistService";
import { Wishlist } from "@/types/wishlist";
import { signOut } from "next-auth/react";
import { cartEvents, wishlistEvents } from "@/utils/events";
import Image from "next/image";

interface CartItem {
  _id: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

interface UserProfile {
  // JWT fields
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  picture?: string;
  // Google auth fields
  given_name?: string;
  family_name?: string;
  name?: string;
}

const HeaderIcon = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartNum, setCartNum] = useState<Cart | null>(null);
  const [wishlistNum, setWishlistNum] = useState<Wishlist | null>(null);

  const totalQuantity = cartNum ? cartNum.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Helper function to get first name (handles both JWT and Google auth)
  const getFirstName = () => {
    return profile?.firstname || profile?.given_name || "";
  };

  // Helper function to get last name (handles both JWT and Google auth)
  const getLastName = () => {
    return profile?.lastname || profile?.family_name || "";
  };

  // Helper function to get full name
  const getFullName = () => {
    const firstName = getFirstName();
    const lastName = getLastName();
    return firstName && lastName ? `${firstName} ${lastName}` : profile?.name || "User";
  };

  // Helper function to get avatar initials
  const getInitials = () => {
    const firstName = getFirstName();
    const lastName = getLastName();
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const iconStyle = (href: string) =>
    `w-6 h-6 transition-colors duration-200 ${
      pathname.startsWith(href) ? "text-red-600" : "text-white"
    } hover:text-red-600`;

  const refreshCart = async () => {
    try {
      const data = await fetchCart();
      setCartNum(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshWishlist = async () => {
    try {
      const data = await fetchWishlist();
      setWishlistNum(data);
    } catch (err) {
      console.error("Error refreshing wishlist:", err);
    }
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial cart and wishlist fetch
  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, []);

  // Subscribe to cart events
  useEffect(() => {
    const unsubscribe = cartEvents.subscribe(() => {
      refreshCart();
    });
    return unsubscribe;
  }, []);

  // Subscribe to wishlist events
  useEffect(() => {
    const unsubscribe = wishlistEvents.subscribe(() => {
      refreshWishlist();
    });
    return unsubscribe;
  }, []);

  // Listen for custom cart and wishlist update events
  useEffect(() => {
    const handleCartUpdate = () => refreshCart();
    const handleWishlistUpdate = () => refreshWishlist();

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await signOut({ redirect: false });
      setProfile(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="flex items-center space-x-4 mr-20 relative">
      {/* Search */}
      <Link href="/search">
        <Search className={iconStyle("/search")} />
      </Link>

      {/* Profile with dropdown */}
      <div className="relative flex items-center" ref={menuRef}>
        <button
          onClick={() => {
            if (!profile) {
              window.location.href = "/auth/login";
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          <User className={iconStyle("/profile")} />
        </button>

        {/* Dropdown menu */}
        {profile && isOpen && (
          <div className="absolute top-8 left-0 mt-2 w-75 bg-white border rounded-lg shadow-lg z-100 overflow-hidden">
            <div className="flex p-2 items-center">
              {/* Avatar */}
              <div className="flex w-[40px] h-[40px] rounded-full justify-center items-center bg-gray-200 text-black text-sm font-semibold overflow-hidden">
                {profile.picture ? (
                  <Image
                    src={profile.picture}
                    alt="avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>

              {/* User info */}
              <div className="block px-4 py-2 text-sm text-black">
                <h2 className="font-semibold">
                  {loading ? "Loading..." : getFullName()}
                </h2>
                <p className="text-[12px] text-gray-600">{profile?.email || ""}</p>
              </div>

              <Link
                href="/profile"
                className="underline text-black text-[12px] text-nowrap py-4 hover:bg-gray-100 cursor-pointer ml-auto"
              >
                Edit Profile
              </Link>
            </div>

            <Link
              href="/"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Home
            </Link>
            <Link
              href="/profile/dashboard"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Profile
            </Link>
            <Link
              href="/profile/notification"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Notification
            </Link>
            <Link
              href="/profile/support"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Support
            </Link>
            <Link
              href="/profile/settings"
              className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center"
            >
              Settings
            </Link>

            <button
              className="w-full text-center px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Wishlist */}
      <Link href="/wishlist" className="relative">
        <Heart className={iconStyle("/wishlist")} />
        {wishlistNum?.products && wishlistNum.products.length > 0 && (
          <span className="absolute top-[-7px] right-[-5px] inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-400 rounded-full">
            {wishlistNum.products.length}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link href="/cart" className="relative">
        <ShoppingCart className={iconStyle("/cart")} />
        {totalQuantity > 0 && (
          <span className="absolute top-[-7px] right-[-8px] inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {totalQuantity}
          </span>
        )}
      </Link>

      <Link href="/chat">
        <MessageCircle size={24} className="hover:text-red-600"/>
      </Link>
    </div>
  );
};

export default HeaderIcon;