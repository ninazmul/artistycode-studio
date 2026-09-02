import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="w-full transition-all duration-300 ease-premium">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <Image
            src="/assets/images/logo.png"
            width={160}
            height={40}
            alt="ArtistyCode Studio logo"
            className="w-[130px] sm:w-[150px] md:w-[160px] h-auto brightness-110 contrast-125"
            priority
          />
        </Link>
        <div className="hidden lg:flex gap-10">
          <NavItems />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <a
            href="https://wa.me/8801580845746?text=Hello%20ArtistyCode%20Studio,%20I%20am%20reaching%20out%20via%20your%20official%20website.%20Please%20assist%20me%20with%20my%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Button
              className="relative overflow-hidden bg-white text-black hover:text-white border-none rounded-lg px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 transition-all duration-300 shadow-inner-glow hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] text-xs sm:text-sm"
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-1.5 sm:gap-2">
                <FaWhatsapp className="text-base sm:text-lg" />
                <span className="hidden sm:inline font-medium">Get Started</span>
              </div>
            </Button>
          </a>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
