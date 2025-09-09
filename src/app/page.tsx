'use client';

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <main className="flex flex-col items-center justify-center h-[calc(100vh-72px)] text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to CarbonX
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          A decentralized platform for Blue Carbon Ecosystem Restoration.
        </p>
      </main>
    </div>
  );
}
