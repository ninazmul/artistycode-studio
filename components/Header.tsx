import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="w-full backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.png"
            width={200}
            height={50}
            alt="ArtistyCode Studio logo"
          />
        </Link>
        <div className="hidden lg:flex gap-8">
          <NavItems />
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/8801580845746?text=Hello%20ArtistyCode%20Studio,%20I%20am%20reaching%20out%20via%20your%20official%20website.%20Please%20assist%20me%20with%20my%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2 bg-gray-100 hover:bg-black text-black hover:text-white hover:border rounded-full rounded-bl-none px-4 py-2 transition"
            >
              <FaWhatsapp className="text-lg" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </a>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
