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
  Shield,
  FilesIcon,
  ShieldHalf,
  Stars,
  CodeIcon,
  DollarSign,
  ListOrderedIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const adminSidebarItems = [
  {
    group: "Core Management",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Projects", url: "/dashboard/projects", icon: FilesIcon },
      { title: "Resources", url: "/dashboard/resources", icon: CodeIcon },
    ],
  },
  {
    group: "Community",
    items: [
      { title: "Testimonials", url: "/dashboard/reviews", icon: Stars },
      { title: "Orders", url: "/dashboard/orders", icon: ListOrderedIcon },
      {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: DollarSign,
      },
    ],
  },
  {
    group: "Administration",
    items: [
      { title: "Moderators", url: "/dashboard/moderators", icon: ShieldHalf },
      { title: "Admins", url: "/dashboard/admins", icon: Shield },
    ],
  },
];

const moderatorSidebarItems = [
  {
    group: "Core Management",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Projects", url: "/dashboard/projects", icon: FilesIcon },
      { title: "Resources", url: "/dashboard/resources", icon: CodeIcon },
    ],
  },
];

interface AdminSidebarProps {
  adminStatus: boolean;
  moderatorStatus: boolean;
}

const AdminSidebar: FC<AdminSidebarProps> = ({
  adminStatus,
  moderatorStatus,
}) => {
  const currentPath = usePathname();

  const sidebarGroups = adminStatus
    ? adminSidebarItems
    : moderatorStatus
      ? moderatorSidebarItems
      : [];

  return (
    <Sidebar
      className="text-white font-semibold font-serif backdrop-blur-md border-r border-white/10"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/assets/images/logo.png"
                width={160}
                height={40}
                alt="ArtistyCode Studio logo"
              />
            </Link>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation Groups */}
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.group} className="space-y-2">
            <SidebarGroupLabel className="uppercase text-xs text-white/50 tracking-wide">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive = currentPath === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                            isActive
                              ? "bg-white text-black font-bold shadow-lg shadow-white/20"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
