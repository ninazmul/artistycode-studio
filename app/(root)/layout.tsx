"use client";

import { Toaster } from "react-hot-toast";
import ScrollHeaderWrapper from "@/components/ScrollHeaderWrapper";
import Header from "@/components/Header";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Toaster />
      <ScrollHeaderWrapper>
        <Header />
      </ScrollHeaderWrapper>

      <InteractiveBackground />

      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}
