"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, BarChart3, Shield, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

// Mock data - in real app this would come from API
const mockStats = {
  totalUsers: 1247,
  activeProjects: 89,
  pendingVerifications: 23,
  issuedCredits: 456789,
  recentActivity: [
    { id: 1, type: "user_approved", message: "New verifier account approved", time: "2 hours ago" },
    { id: 2, type: "project_submitted", message: "Carbon project submitted by GreenTech Inc", time: "4 hours ago" },
    { id: 3, type: "credits_issued", message: "10,000 carbon credits issued", time: "6 hours ago" },
  ]
};

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Check if user is admin
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      icon: FileText,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications.toString(),
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Credits Issued",
      value: stats.issuedCredits.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Shield className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => router.push('/dashboard/admin/users')}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Approve/reject onboarding requests and assign roles</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-yellow-400">12 pending</span>
                <span className="text-green-400">1,235 active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => router.push('/dashboard/admin/verification')}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Review and approve/reject submitted projects</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-yellow-400">23 pending</span>
                <span className="text-green-400">156 approved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => router.push('/dashboard/admin/analytics')}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                System Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Monitor system performance and carbon credit metrics</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-green-400">↑ 12% this month</span>
                <span className="text-blue-400">View reports</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'user_approved' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {activity.type === 'project_submitted' && <FileText className="w-4 h-4 text-blue-400" />}
                    {activity.type === 'credits_issued' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                    <span className="text-gray-300">{activity.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
