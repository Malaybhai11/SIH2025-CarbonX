"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Eye,
  Download,
  MapPin,
  Calendar
} from "lucide-react";

// Mock data - in real app this would come from API
const mockProjects = [
  {
    id: "1",
    name: "Amazon Rainforest Protection",
    status: "verified",
    credits: 50000,
    submittedDate: "2024-01-15",
    verifiedDate: "2024-01-20",
    location: "Brazil",
    type: "Reforestation"
  },
  {
    id: "2",
    name: "Solar Farm Development",
    status: "under_review",
    credits: 25000,
    submittedDate: "2024-01-22",
    location: "California, USA",
    type: "Renewable Energy"
  },
  {
    id: "3",
    name: "Mangrove Restoration",
    status: "pending",
    credits: 15000,
    submittedDate: "2024-01-25",
    location: "Indonesia",
    type: "Coastal Protection"
  }
];

const mockStats = {
  totalCredits: 125000,
  activeProjects: 3,
  pendingVerification: 1,
  verifiedProjects: 2
};

export default function OrganizationDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState(mockProjects);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "organization") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-600">Under Review</Badge>;
      case "pending":
        return <Badge className="bg-blue-600">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "under_review":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push('/dashboard/organization/submit')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Credits</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCredits.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Verification</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingVerification}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.verifiedProjects}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/organization/submit')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="w-5 h-5 mr-2 text-green-400" />
                Submit Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Create and submit a new carbon credit project</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/organization/uploads')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Upload className="w-5 h-5 mr-2 text-blue-400" />
                Data Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Upload monitoring data, reports, and evidence</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/organization/credits')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                Carbon Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">View issued credits and transaction history</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(project.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.submittedDate}
                        </span>
                        <span>{project.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Credits</p>
                      <p className="text-lg font-semibold text-white">{project.credits.toLocaleString()}</p>
                    </div>
                    {getStatusBadge(project.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
