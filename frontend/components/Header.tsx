import React from "react";
import HeaderMenu from "@/components/HeaderMenu";
import HeaderIcon from "@/components/HeaderIcon";
import Logo from "@/components/Logo";
import Container from "./Container";
import Highlight from "@/components/Highlight";
const Header = () => {
  return (
    <header className="w-full">
      <Highlight />
      <Container className="flex items-center justify-between py-4 rounded-3xl bg-[#3C215F] text-white mt-14">
        <Logo />
        <HeaderMenu />
        <HeaderIcon />
      </Container>
    </header>
  );
};

export default Header;
