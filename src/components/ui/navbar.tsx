"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "./button";
import { Menu, X, Home, Users, FileText, BarChart3, Shield, Settings } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const userRole = (user?.unsafeMetadata as any)?.role || "organization";

  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
    ];

    switch (userRole) {
      case "admin":
        return [
          ...baseItems,
          { href: "/dashboard/admin", label: "NCCR Admin Panel", icon: Shield },
          { href: "/dashboard/admin/review-project", label: "Review Projects", icon: FileText },
          { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
        ];
      case "organization":
        return [
          ...baseItems,
          { href: "/dashboard/projects", label: "My Projects", icon: FileText },
          { href: "/submit", label: "Submit Project", icon: FileText },
        ];
      case "local":
        return [
          ...baseItems,
          { href: "/dashboard/local", label: "My Contributions", icon: FileText },
          { href: "/contribute-data", label: "Contribute Data", icon: FileText },
        ];
      default:
        return [
          ...baseItems,
          { href: "/projects", label: "Browse Projects", icon: FileText },
          { href: "/transparency", label: "Transparency", icon: BarChart3 },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CX</span>
              </div>
              <span className="text-white font-bold text-xl">CarbonX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="ml-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 mr-2",
                },
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
