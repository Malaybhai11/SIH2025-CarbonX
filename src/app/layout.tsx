// app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
          {/* Navbar */}
          <header className="flex justify-between items-center p-4 h-16 bg-black text-white border-b border-gray-800">
            <h1 className="text-xl font-bold text-teal-400">CarbonX</h1>
            <div className="flex gap-4">
              <SignedOut>
                <Link href="/sign-in">
                  <button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm sm:text-base">
                    SignIn
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm sm:text-base">
                    Sign Up
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Page Content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
