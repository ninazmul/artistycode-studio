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
  SidebarFooter,
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
  Users,
  BookOpen,
  ExternalLink,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const adminSidebarItems = [
  {
    group: "Core",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Blog", url: "/dashboard/blog", icon: BookOpen },
      { title: "Projects", url: "/dashboard/projects", icon: FilesIcon },
      { title: "Resources", url: "/dashboard/resources", icon: CodeIcon },
      { title: "Leads", url: "/dashboard/leads", icon: Users },
    ],
  },
  {
    group: "Revenue",
    items: [
      { title: "Testimonials", url: "/dashboard/reviews", icon: Stars },
      { title: "Quotations", url: "/dashboard/quotations", icon: FileText },
      { title: "Orders", url: "/dashboard/orders", icon: ListOrderedIcon },
      { title: "Transactions", url: "/dashboard/transactions", icon: DollarSign },
    ],
  },
  {
    group: "Admin",
    items: [
      { title: "Moderators", url: "/dashboard/moderators", icon: ShieldHalf },
      { title: "Admins", url: "/dashboard/admins", icon: Shield },
    ],
  },
];

const moderatorSidebarItems = [
  {
    group: "Core",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Blog", url: "/dashboard/blog", icon: BookOpen },
      { title: "Projects", url: "/dashboard/projects", icon: FilesIcon },
      { title: "Resources", url: "/dashboard/resources", icon: CodeIcon },
      { title: "Leads", url: "/dashboard/leads", icon: Users },
      { title: "Quotations", url: "/dashboard/quotations", icon: FileText },
    ],
  },
];

interface AdminSidebarProps {
  adminStatus: boolean;
  moderatorStatus: boolean;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ adminStatus, moderatorStatus }) => {
  const currentPath = usePathname();

  const sidebarGroups = adminStatus
    ? adminSidebarItems
    : moderatorStatus
      ? moderatorSidebarItems
      : [];

  return (
    <Sidebar
      className="border-r border-white/[0.06] bg-[#090909]"
      collapsible="icon"
    >
      <SidebarContent className="bg-[#090909] py-4">
        {/* Logo */}
        <SidebarGroup className="px-3 mb-2">
          <SidebarGroupLabel className="p-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.png"
                width={130}
                height={33}
                alt="ArtistyCode Studio"
                className="opacity-90"
              />
            </Link>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 h-px bg-white/[0.06] mb-3" />

        {/* Navigation Groups */}
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.group} className="px-3 mb-1">
            <SidebarGroupLabel className="uppercase text-[10px] font-semibold text-white/25 tracking-[0.12em] px-2 mb-1">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const isActive = currentPath === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-white/10 text-white border border-white/10 shadow-sm"
                              : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          <item.icon
                            className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-white/40"}`}
                          />
                          <span>{item.title}</span>
                          {isActive && (
                            <span className="ml-auto w-1 h-1 rounded-full bg-emerald-400" />
                          )}
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

      <SidebarFooter className="bg-[#090909] border-t border-white/[0.06] px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Public Site
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
