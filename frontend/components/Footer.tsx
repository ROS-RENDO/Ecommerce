import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#3C215F] h-[250px]">
      <div className="relative flex justify-between items-start h-full px-40 py-10 ">
        <div className="text-white">
          <h2>SHOPPIIPOP</h2>
          <p className="w-60 text-sm">
            Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit.
            Gravida massa volutpat aenean odio erat nullam fringilla.
          </p>
          <h3 className="underline font-semibold ">Follow Us on</h3>
          <div className="flex gap-4 mt-3">
            <Link href="https://facebook.com">
              <Image
                src="/Icon/facebook.png"
                alt="facebook"
                width={20}
                height={20}
                className=""
              ></Image>
            </Link>
            <Link href="https://instagram.com">
              <Image
                src="/Icon/Instagram.png"
                alt="instagram"
                width={20}
                height={20}
                className=""
              ></Image>
            </Link>
            <Link href="https://x.com">
              <Image
                src="/Icon/x.png"
                alt="x"
                width={20}
                height={20}
                className=""
              ></Image>
            </Link>
            <Link href="https://Linkedin.com">
              <Image
                src="/Icon/Linkedin.png"
                alt="linkedin"
                width={20}
                height={20}
                className=""
              ></Image>
            </Link>
            <Link href="https://Youtube.com">
              <Image
                src="/Icon/youtube.png"
                alt="youtube"
                width={20}
                height={20}
                className=""
              ></Image>
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-white">QUICK LINKS</h2>
          <ul className="text-white text-sm space-y-2">
            <Link href="/">
              <li>Home</li>
            </Link>
            <Link href="/shop">
              <li>Shop</li>
            </Link>
            <Link href="/bestseller">
              <li>Best Seller</li>
            </Link>
            <Link href="/new-arrival">
              <li>New arrival</li>
            </Link>
            <Link href="/about">
              <li>About</li>
            </Link>
            <Link href="/contact">
              <li>Contact</li>
            </Link>
          </ul>
        </div>
        <div>
          <h2 className="text-white">HELP & INFO</h2>
          <ul className="text-white text-sm space-y-2">
            <li>TRACK YOUR ORDER</li>
            <li>RETURNS POLICIES</li>
            <li>SHIPPING + delivery</li>
            <li>CONTACT US</li>
            <li>FAGS</li>
          </ul>
        </div>
        <div className="text-white">
          <h2 className="">CONTACT US</h2>
          <p className="text-sm">Do you have any queries or suggestions?</p>
          <a href="#" className="underline">
            yourinfo@gmail.com
          </a>
          <p className=" text-sm ">If you need support? Just give us a call</p>
          <p className=" text-sm underline">+855 010 143 129</p>
          <p className=" text-sm underline">+855 012 143 129</p>
        </div>
        <div className="bg-white absolute w-[80%] h-[1px] bottom-0 mb-10"></div>
        <div className="absolute text-white text-sm flex left-0 right-0 bottom-0 justify-between px-40 py-2">
          <p className=""> ©2025 SHOPPIIPOP. All rights reserved.</p>
          <ul className="flex gap-4 cursor-pointer">
            <li>Cookies Policy</li>
            <li>Legal Terms</li>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
