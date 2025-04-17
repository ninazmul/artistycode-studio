"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaBackward } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ProjectHeader() {
  const router = useRouter(); // Initialize the router

  const handleGoBack = () => {
    router.back(); // Navigate back one route
  };

  return (
    <header className="w-full backdrop-blur-md shadow-md bg-black-100">
      <div className="flex items-center justify-between p-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.png"
            width={50}
            height={50}
            alt="ArtistyCode Studio logo"
          />
          <h1 className="hidden md:flex text-3xl font-semibold">
            ArtistyCode Studio
          </h1>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-none text-purple hover:bg-purple-200 focus:ring-2 focus:ring-purple-300"
          onClick={handleGoBack}
        >
          <FaBackward className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </header>
  );
}
