"use client";

import { Toaster } from "react-hot-toast";
import ScrollHeaderWrapper from "@/components/ScrollHeaderWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Toaster />
      <ScrollHeaderWrapper>
        <Header />
      </ScrollHeaderWrapper>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
