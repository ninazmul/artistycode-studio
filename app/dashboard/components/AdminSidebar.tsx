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
import {
  LayoutDashboard,
  Users,
  Shield,
  ImageIcon,
  Text,
  FilesIcon,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Volunteers",
    url: "/dashboard/volunteers",
    icon: Users,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Banners",
    url: "/dashboard/banners",
    icon: ImageIcon,
  },
  {
    title: "NoticeBoard",
    url: "/dashboard/notices",
    icon: Text,
  },
  {
    title: "Resources",
    url: "/dashboard/resources",
    icon: FilesIcon,
  },
  {
    title: "Admins",
    url: "/dashboard/admins",
    icon: Shield,
  },
];

const AdminSidebar = () => {
  const currentPath = usePathname();

  return (
    <Sidebar
      className="text-primary-900 font-semibold font-serif"
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
                alt="Islamic Education Australia logo"
              />{" "}
              <h1 className="text-xl font-serif font-bold text-primary-900">
                IEA Ltd
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
                          "bg-gradient-to-r from-primary-900 to-primary-500 text-white"
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
