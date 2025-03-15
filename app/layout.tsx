import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArtistyCode Studio | Innovative Software Development",
  description:
    "ArtistyCode Studio is a cutting-edge software development agency, delivering innovative, scalable, and efficient digital solutions tailored to your business needs.",
  keywords: [
    "ArtistyCode Studio",
    "Software Development",
    "Web Development",
    "MERN Stack",
    "Next.js Development",
    "Custom Software Solutions",
    "AI & ML Development",
    "App Development",
    "Game Development",
    "Software Consultancy",
    "Software Company",
    "Software Agency",
    "Software Development Agency",
    "Software Development Company",
    "Software Development Studio",
    "Software Development Services",
    "Software Development Firm",
    "Software Development Partner",
    "Software Development Outsourcing",
    "Software Development Consultancy",
  ],
  icons: {
    icon: "/assets/images/favicon.ico",
    shortcut: "/assets/images/favicon.ico",
    apple: "/assets/images/logo.png",
  },
  alternates: {
    canonical: "https://www.artistycode.studio/",
  },
  openGraph: {
    title: "ArtistyCode Studio | Innovative Software Development",
    description:
      "ArtistyCode Studio specializes in custom web and software development, AI integration, and scalable digital solutions for businesses worldwide.",
    url: "https://www.artistycode.studio/",
    siteName: "ArtistyCode Studio",
    images: [
      {
        url: "https://www.artistycode.studio/assets/images/ArtistyCode Studio.jpg",
        width: 1200,
        height: 630,
        alt: "ArtistyCode Studio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtistyCode Studio | Innovative Software Development",
    description:
      "We craft high-performance digital solutions with a focus on innovation and scalability. Let’s build the future together.",
    images: [
      "/assets/images/ArtistyCode Studio.jpg",
    ],
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.variable}>
          <Analytics />
          <SpeedInsights />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
