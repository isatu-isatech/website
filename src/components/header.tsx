import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <>
      <div className="border-b-grey-100 sticky top-0 flex items-center justify-between border-b bg-white/65 px-6 py-2 shadow-xs shadow-black/5 backdrop-blur-xs lg:px-8 xl:px-16">
        <Link href="/">
          <Image
            src="/assets/isatech-dark.svg"
            alt="Logo"
            width={24}
            height={40}
          />
        </Link>
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          <div className="hidden items-center gap-6 lg:flex">
            <Link href="/">
              <p className="text-caption">Achievements</p>
            </Link>
            <Link href="/">
              <p className="text-caption">Contact Us</p>
            </Link>
            <Link href="/">
              <p className="text-caption">About Us</p>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/">
                <p className="text-caption">Join Now</p>
              </Link>
            </Button>
            <Button asChild className="lg:hidden">
              <Link href="/">
                <Menu />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
