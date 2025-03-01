"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemsProps {
  onItemSelected?: () => void;
}

const NavItems = ({ onItemSelected }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <ul className="lg:flex-between flex w-full flex-col items-start gap-5 lg:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive &&
              "bg-white-100/10 px-2 py-1 rounded-md backdrop-blur-md shadow-md"
            } flex-center whitespace-nowrap text-white-100 w-full`}
          >
            <Link href={link.route} onClick={onItemSelected}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
