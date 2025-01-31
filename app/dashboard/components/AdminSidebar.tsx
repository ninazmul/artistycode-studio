"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Shield, FilesIcon, ShieldHalf, Stars } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const adminSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FilesIcon,
  },
  {
    title: "Testimonials",
    url: "/dashboard/reviews",
    icon: Stars,
  },
  {
    title: "Moderators",
    url: "/dashboard/moderators",
    icon: ShieldHalf,
  },
  {
    title: "Admins",
    url: "/dashboard/admins",
    icon: Shield,
  },
];

const moderatorSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FilesIcon,
  },
  {
    title: "Testimonials",
    url: "/dashboard/reviews",
    icon: Stars,
  },
];

interface AdminSidebarProps {
  adminStatus: boolean;
  moderatorStatus: boolean;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ adminStatus, moderatorStatus }) => {
  const currentPath = usePathname();

  const sidebarItems = adminStatus
    ? adminSidebarItems
    : moderatorStatus
    ? moderatorSidebarItems
      : [];
  
  return (
    <Sidebar
      className="text-purple font-semibold font-serif"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup className="space-y-4">
          <SidebarGroupLabel>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.png"
                width={20}
                height={20}
                alt="ACS logo"
              />{" "}
              <h1 className="text-xl font-serif font-bold text-primary-900">
                ArtistyCode Studio
              </h1>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                          isActive &&
                          "bg-gradient-to-r from-purple to-blue-500 text-white"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
