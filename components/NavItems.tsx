"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItemsProps {
  onItemSelected?: () => void;
}

const NavItems = ({ onItemSelected }: NavItemsProps) => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  // Effect to track changes in pathname and hash
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    // Initialize the state on mount and listen for changes
    updatePath();
    window.addEventListener("hashchange", updatePath);
    window.addEventListener("popstate", updatePath); // for back/forward navigation

    // Cleanup event listeners
    return () => {
      window.removeEventListener("hashchange", updatePath);
      window.removeEventListener("popstate", updatePath);
    };
  }, [pathname]); // Also depend on pathname to handle page load/reload

  return (
    <ul className="lg:flex-between flex w-full flex-col items-start gap-5 lg:flex-row">
      {headerLinks.map((link) => {
        const isActive =
          currentPath === link.route || // Matches exact route (e.g., "/about")
          (link.route.includes("#") && currentPath.includes(link.route)); // Matches hash routes (e.g., "/#about")

        return (
          <li
            key={link.route}
            className={`${
              isActive
                ? "bg-white-100/10 px-2 py-1 rounded-md backdrop-blur-md shadow-md"
                : ""
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
