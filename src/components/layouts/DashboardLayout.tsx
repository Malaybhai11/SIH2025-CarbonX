"use client";

import { ReactNode } from "react";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import SpaceBackground from "@/components/SpaceBackground";

interface DashboardLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function DashboardLayout({ children, showSidebar = true }: DashboardLayoutProps) {
  return (
    <SpaceBackground>
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="flex">
          {showSidebar && <Sidebar className="w-64 min-h-screen" />}
          <main className={`flex-1 p-6 ${showSidebar ? 'ml-0' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </SpaceBackground>
  );
}
