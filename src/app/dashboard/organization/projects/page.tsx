"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  MoreVertical,
  Activity,
  DollarSign,
  Leaf,
  BarChart3
} from "lucide-react";

// Mock project data
const mockProjects = {
  overview: {
    totalProjects: 8,
    activeProjects: 5,
    pendingProjects: 2,
    completedProjects: 1,
    totalCredits: 45600,
    potentialCredits: 68400,
    avgProjectDuration: 18, // months
    successRate: 87.5 // percentage
  },
  projects: [
    {
      id: "1",
      name: "Amazon Rainforest Conservation",
      description: "Large-scale reforestation project in the Brazilian Amazon focusing on native species restoration and biodiversity protection.",
      type: "Reforestation",
      location: "Brazil, Amazon Basin",
      coordinates: "-3.4653, -62.2159",
      status: "approved",
      credits: {
        expected: 15000,
        issued: 12500,
        remaining: 2500
      },
      timeline: {
        startDate: "2024-01-15",
        endDate: "2025-06-30",
        duration: 17, // months
        progress: 75
      },
      methodology: "VM0015 - Methodology for Avoided Unplanned Deforestation",
      files: [
        { name: "Project Design Document.pdf", size: "2.4 MB", uploaded: "2024-01-10" },
        { name: "Baseline Study.pdf", size: "1.8 MB", uploaded: "2024-01-12" },
        { name: "Monitoring Report Q1.pdf", size: "1.2 MB", uploaded: "2024-04-05" }
      ],
      lastUpdate: "2024-12-15",
      verification: {
        status: "verified",
        date: "2024-11-20",
        auditor: "Gold Standard Verification"
      }
    },
    {
      id: "2",
      name: "Solar Energy Farm - Maharashtra",
      description: "50MW solar photovoltaic power plant providing clean energy to rural communities in Maharashtra state.",
      type: "Renewable Energy",
      location: "Maharashtra, India",
      coordinates: "19.7515, 75.7139",
      status: "under_review",
      credits: {
        expected: 8500,
        issued: 0,
        remaining: 8500
      },
      timeline: {
        startDate: "2024-06-01",
        endDate: "2026-05-31",
        duration: 24,
        progress: 35
      },
      methodology: "AMS-I.D - Grid connected renewable electricity generation",
      files: [
        { name: "Technical Specifications.pdf", size: "3.1 MB", uploaded: "2024-05-25" },
        { name: "Environmental Impact Assessment.pdf", size: "4.2 MB", uploaded: "2024-05-28" }
      ],
      lastUpdate: "2024-12-10",
      verification: {
        status: "pending",
        date: null,
        auditor: "TBD"
      }
    },
    {
      id: "3",
      name: "Mangrove Restoration Project",
      description: "Coastal mangrove ecosystem restoration project protecting against sea level rise and supporting marine biodiversity.",
      type: "Ocean Protection",
      location: "Kerala, India",
      coordinates: "9.9312, 76.2673",
      status: "pending",
      credits: {
        expected: 6800,
        issued: 0,
        remaining: 6800
      },
      timeline: {
        startDate: "2024-08-15",
        endDate: "2026-08-15",
        duration: 24,
        progress: 15
      },
      methodology: "VM0007 - REDD+ Methodology Framework",
      files: [
        { name: "Project Proposal.pdf", size: "2.8 MB", uploaded: "2024-08-10" }
      ],
      lastUpdate: "2024-12-05",
      verification: {
        status: "not_started",
        date: null,
        auditor: null
      }
    },
    // Add more mock projects as needed
  ]
};

export default function MyProjectsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "organization") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-600";
      case "under_review": return "bg-yellow-600";
      case "pending": return "bg-blue-600";
      case "rejected": return "bg-red-600";
      case "completed": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "under_review": return <Clock className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "completed": return <Target className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredProjects = projects.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-gray-400 mt-1">Manage and monitor your carbon credit projects</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/dashboard/organization/projects/create')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{projects.overview.totalProjects}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-sm text-blue-400">{projects.overview.activeProjects} active</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Credits Issued</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(projects.overview.totalCredits)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">{projects.overview.successRate}% success rate</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Potential Credits</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(projects.overview.potentialCredits)}</p>
                  <div className="flex items-center mt-1">
                    <Leaf className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-400">Future value</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Duration</p>
                  <p className="text-2xl font-bold text-white">{projects.overview.avgProjectDuration}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-sm text-purple-400">months</span>
                  </div>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search projects by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Reforestation">Reforestation</SelectItem>
                  <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                  <SelectItem value="Ocean Protection">Ocean Protection</SelectItem>
                  <SelectItem value="Soil Conservation">Soil Conservation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          {project.status.replace('_', ' ')}
                        </div>
                      </Badge>
                      <Badge variant="outline" className="border-gray-600">
                        {project.type}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.timeline.duration} months
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {formatNumber(project.credits.expected)} credits expected
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700"
                      onClick={() => router.push(`/dashboard/organization/projects/${project.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700"
                      onClick={() => router.push(`/dashboard/organization/projects/${project.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-400">{project.timeline.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.timeline.progress}%` }}
                    />
                  </div>
                </div>

                {/* Credits and Files Info */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-gray-400">Credits Issued</p>
                      <p className="text-lg font-bold text-green-400">{formatNumber(project.credits.issued)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Remaining</p>
                      <p className="text-lg font-bold text-yellow-400">{formatNumber(project.credits.remaining)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Files</p>
                      <p className="text-lg font-bold text-blue-400 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {project.files.length}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-sm text-white">{new Date(project.lastUpdate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
              <p className="text-gray-400 mb-6">No projects match your current search and filter criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                variant="outline"
                className="border-gray-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
