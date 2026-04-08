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
    <header className="w-full max-w-6xl mx-auto backdrop-blur-md shadow-md bg-black">
      <div className="flex items-center justify-between p-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.png"
            width={200}
            height={50}
            alt="ArtistyCode Studio logo"
          />
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-none text-white hover:text-black hover:bg-white focus:ring-2 focus:ring-white-300"
          onClick={handleGoBack}
        >
          <FaBackward className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </header>
  );
}
