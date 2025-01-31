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
import { isModerator } from "@/lib/actions/moderator.actions";

export default async function Header() {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);
  const moderatorStatus = await isModerator(email);

  return (
    <header className="w-full backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between p-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.png"
            width={50}
            height={50}
            alt="ACS logo"
          />
          <h1 className="hidden md:flex text-3xl font-semibold">
            ArtistyCode Studio
          </h1>
        </Link>
        <div className="hidden lg:flex gap-8">
          <NavItems />
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            {adminStatus || moderatorStatus && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full border-purple text-purple"
              >
                <Link href="/dashboard">
                  <Shield className="w-4 h-4" />
                  Dashboard
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
