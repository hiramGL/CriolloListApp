"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "CriolloList",
//   description: "Discover and connect with student services.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check if the current route is for login or signup
  const isAuthPage = pathname === "/login" || pathname === "/sign-up";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${
          isAuthPage
            ? "min-h-screen flex items-center justify-center bg-cover bg-center"
            : "min-h-screen bg-[#f9fafb] text-gray-800 p-6 bg-cover bg-center"
        }`}
        style={
          isAuthPage
            ? {
                backgroundImage: "url('/campus-area.jpg')",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backgroundBlendMode: "overlay",
              }
            : {
                backgroundImage: "url('/green-paw-pattern.jpg')",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backgroundBlendMode: "overlay",
              }
        }
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
