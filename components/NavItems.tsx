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
              ""
            } flex-center whitespace-nowrap`}
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
