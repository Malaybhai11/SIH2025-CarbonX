// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarbonX",
  description: "The Only MRV Platform For Blue Carbon Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00ff00", // Green color to match the space theme
        },
        elements: {
          card: "bg-black border border-gray-800",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-gray-900 text-white border-gray-700",
          socialButtonsBlockButtonText: "text-white",
          formButtonPrimary: "bg-green-600 hover:bg-green-700",
          navbar: "bg-gray-900",
          navbarMobileMenuButton: "text-white",
          formFieldInput: "bg-gray-900 text-white border-gray-700",
          formFieldLabel: "text-white",
          footerAction: "text-green-400",
          footerActionLink: "text-green-400 hover:text-green-300",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
          {/* Page Content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
