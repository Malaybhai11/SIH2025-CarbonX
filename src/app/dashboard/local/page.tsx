"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  CheckCircle,
  MapPin,
  BarChart3,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react";

// Mock data - in real app this would come from API
const mockContributions = [
  {
    id: "1",
    type: "Environmental Observation",
    description: "Reported mangrove degradation in coastal area",
    location: "Chennai Coast, India",
    date: "2024-01-20",
    status: "verified",
    impact: "High"
  },
  {
    id: "2",
    type: "Data Collection",
    description: "Water quality measurements for blue carbon project",
    location: "Puducherry, India",
    date: "2024-01-18",
    status: "under_review",
    impact: "Medium"
  },
  {
    id: "3",
    type: "Community Report",
    description: "Local fishing community impact assessment",
    location: "Kerala Coast, India",
    date: "2024-01-15",
    status: "verified",
    impact: "High"
  }
];

const mockStats = {
  totalContributions: 24,
  verifiedContributions: 18,
  pendingReview: 3,
  totalImpact: "High"
};

export default function LocalDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [contributions, setContributions] = useState(mockContributions);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "local") {
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

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "High":
        return <Badge className="bg-red-600">High Impact</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-600">Medium Impact</Badge>;
      case "Low":
        return <Badge className="bg-green-600">Low Impact</Badge>;
      default:
        return <Badge className="bg-gray-600">{impact}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Local Contributor Dashboard</h1>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push('/dashboard/local/contribute')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Contribute Data
          </Button>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-green-900/50 border-blue-600/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Welcome to CarbonX Community</h2>
                <p className="text-gray-300">
                  Your local observations and data contributions help build accurate carbon credit projects.
                  Together, we're protecting our planet's blue carbon ecosystems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Contributions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalContributions}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified</p>
                  <p className="text-2xl font-bold text-white">{stats.verifiedContributions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Under Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingReview}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Community Impact</p>
                  <p className="text-lg font-bold text-white">{stats.totalImpact}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/local/contribute')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="w-5 h-5 mr-2 text-green-400" />
                Contribute Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Share environmental observations, photos, or measurements</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/local/nearby')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Nearby Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">View carbon projects in your area and contribute locally</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => router.push('/dashboard/local/impact')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                My Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">See how your contributions are making a difference</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contributions */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">My Recent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{contribution.type}</h3>
                      <p className="text-gray-400 mb-1">{contribution.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {contribution.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {contribution.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getImpactBadge(contribution.impact)}
                    {getStatusBadge(contribution.status)}
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
