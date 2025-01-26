import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "./NavItems";
import { LogIn, Shield } from "lucide-react";
import MobileNav from "./MobileNav";
import { auth } from "@clerk/nextjs/server";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import { Button } from "./ui/button";

export default async function Header() {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  return (
    <header className="w-full backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between p-4 lg:px-8">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            width={50}
            height={50}
            alt="ACS logo"
          />
        </Link>
        <div className="hidden lg:flex gap-8">
          <NavItems />
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            {adminStatus && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full border-gray-300 hover:bg-gray-100"
              >
                <Link href="/dashboard">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}
            <UserButton afterSwitchSessionUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2 rounded-full border-purple text-purple"
            >
              <Link href="/sign-in">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </Button>
          </SignedOut>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
