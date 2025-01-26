"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NavItems from "./NavItems";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <nav className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="align-middle">
          <Menu className="text-purple"/>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 backdrop-blur-md shadow-md lg:hidden w-11/12">
          <Link
            href={"/"}
            className="flex items-center gap-2"
            onClick={handleClose}
          >
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              ArtistyCode Studio
            </h1>
          </Link>
          <Separator className="border border-purple" />
          <NavItems onItemSelected={handleClose} />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
