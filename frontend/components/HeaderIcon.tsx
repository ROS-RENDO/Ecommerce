"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/api/authService";
import { getProfile } from "@/app/api/profileService";


const HeaderIcon = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [profile, setProfile]= useState< {firstname?: string; lastname?: string;email?: string; username?: string} | null> (null);
  const [loading, setLoading]= useState(true)

  const iconStyle = (href: string) =>
    `w-6 h-6 transition-colors duration-200 ${
      pathname.startsWith(href) ? "text-red-600" : "text-white"
    } hover:text-red-600`;

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

  useEffect(()=>{
    const fetchProfile= async()=>{
      try {
        setLoading(true);
        const user = await getProfile();
        console.log("Fetched user: ", user);
        if (user){
          setProfile(user);
        }
      } catch (error) {
        console.error("Error fetching profile: ", error)
      } finally{
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout= async()=>{
    try {
      await logoutUser();
      window.location.href= "/";
    } catch (err) {
      console.error("Logout error", err)
      alert("Logout failed")
    }
  }


  return (
    <div className="flex items-center space-x-4 mr-20 relative">
      {/* Search */}
      <Link href="/search">
        <Search className={iconStyle("/search")} />
      </Link>

      {/* Profile with dropdown */}
      <div className="relative flex items-center" ref={menuRef}>
        <button onClick={() => setIsOpen(!isOpen)}>
          <User className={iconStyle("/profile")} />
        </button>

        {isOpen && (
          <div className="absolute top-8 left-0 mt-2 w-75 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="flex p-2">
              <div className="flex px-4 py-2 text-sm hover:bg-gray-100 text-black w-[48px] h-[48px] rounded-full justify-center items-center">{profile?.firstname?.[0]}{profile?.lastname?.[0]}</div>
              <div className="block px-4 py-2 text-sm hover:bg-gray-100 text-black">
                <h2> {loading 
                    ? "Loading..." 
                    : profile 
                    ? `${profile.firstname} ${profile.lastname}` 
                    : "Guest User"
                  } </h2>
                <p className="text-sm">{profile?.email || ""}</p>
              </div>
              <p className="underline text-black text-[12px] text-nowrap py-4 hover:bg-gray-100">Edit Profile</p>
              <div className="block px-4 py-2 text-sm hover:bg-gray-100 text-black"></div>

            </div>
            <Link href="/" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">Home</Link>
            <Link href="/profile/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">dashboard</Link>
            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">Profile</Link>
            <Link href="/profile/notification" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">Notification</Link>
            <Link href="/profile/support" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">Support</Link>
            <Link href="/profile/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 text-black text-center">Settings</Link>
            {profile &&
            <button
            className="w-full text-center px-4 py-2 text-sm hover:bg-gray-100 text-red-500 "
            onClick={handleLogout}
            // Add logout logic here
            
            >
              Logout
            </button>
            }
          </div>
        )}
      </div>

      {/* Wishlist */}
      <Link href="/wishlist">
        <Heart className={iconStyle("/wishlist")} />
      </Link>

      {/* Cart */}
      <Link href="/cart" className="relative">
        <ShoppingCart className={iconStyle("/cart")} />
        <span className="absolute top-[-7px] -right-1/2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
          1
        </span>
      </Link>
    </div>
  );
};

export default HeaderIcon;
