"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  BarChart3,
  Shield,
  Settings,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Search,
  Download,
  MapPin
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();

  const userRole = (user?.unsafeMetadata as any)?.role || "organization";

  const getSidebarItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Overview", icon: Home },
          { href: "/dashboard/admin/users", label: "User Management", icon: Users },
          { href: "/dashboard/admin/review-project", label: "Project Management", icon: FileText },
          { href: "/dashboard/admin/verification", label: "Verification Queue", icon: CheckCircle },
          { href: "/dashboard/admin/analytics", label: "System Analytics", icon: BarChart3 },
          { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
        ];
      case "organization":
        return [
          { href: "/dashboard/organization", label: "Dashboard", icon: Home },
          { href: "/dashboard/organization/projects", label: "My Projects", icon: FileText },
          { href: "/dashboard/organization/submit", label: "Submit Project", icon: Plus },
          { href: "/dashboard/organization/uploads", label: "Data Uploads", icon: Upload },
          { href: "/dashboard/organization/credits", label: "Carbon Credits", icon: BarChart3 },
        ];
      case "local":
        return [
          { href: "/dashboard/local", label: "Dashboard", icon: Home },
          { href: "/dashboard/local/contributions", label: "My Contributions", icon: FileText },
          { href: "/dashboard/local/contribute", label: "Contribute Data", icon: Plus },
          { href: "/dashboard/local/nearby", label: "Nearby Projects", icon: MapPin },
          { href: "/dashboard/local/impact", label: "My Impact", icon: BarChart3 },
        ];
      default:
        return [
          { href: "/dashboard", label: "Dashboard", icon: Home },
          { href: "/projects", label: "Browse Projects", icon: Search },
          { href: "/projects/map", label: "Project Map", icon: Eye },
          { href: "/transparency", label: "Transparency", icon: BarChart3 },
          { href: "/reports", label: "Reports", icon: Download },
        ];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className={`bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 ${className}`}>
      <div className="p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-600/20 text-green-400 border border-green-600/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
