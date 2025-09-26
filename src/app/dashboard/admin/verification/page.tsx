"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Search,
  Filter,
  Download,
  AlertTriangle
} from "lucide-react";

// Mock data - in real app this would come from API
const mockProjects = [
  {
    id: "1",
    name: "Amazon Rainforest Protection",
    organization: "GreenTech Inc",
    type: "Reforestation",
    location: "Brazil",
    submittedDate: "2024-01-15",
    expectedCredits: 50000,
    status: "pending_review",
    documents: ["project_proposal.pdf", "environmental_impact.pdf", "baseline_study.pdf"],
    description: "Large-scale reforestation project in the Amazon basin to restore degraded forest lands and sequester carbon dioxide."
  },
  {
    id: "2",
    name: "Solar Farm Development",
    organization: "EcoCorp",
    type: "Renewable Energy",
    location: "California, USA",
    submittedDate: "2024-01-18",
    expectedCredits: 25000,
    status: "pending_review",
    documents: ["feasibility_study.pdf", "environmental_assessment.pdf"],
    description: "Development of a 50MW solar farm on previously degraded agricultural land."
  },
  {
    id: "3",
    name: "Mangrove Restoration",
    organization: "Sustainable Solutions",
    type: "Coastal Protection",
    location: "Indonesia",
    submittedDate: "2024-01-20",
    expectedCredits: 15000,
    status: "under_review",
    documents: ["restoration_plan.pdf", "community_engagement.pdf"],
    description: "Restoration of degraded mangrove ecosystems along the Indonesian coastline."
  }
];

export default function VerificationQueue() {
  const { user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvedCredits, setApprovedCredits] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (projectId: string) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, status: "approved" as const } : p
    ));
    setSelectedProject(null);
    setReviewNotes("");
    setApprovedCredits("");
  };

  const handleReject = (projectId: string) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, status: "rejected" as const } : p
    ));
    setSelectedProject(null);
    setReviewNotes("");
    setApprovedCredits("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Rejected</Badge>;
      case "pending_review":
        return <Badge className="bg-blue-600">Pending Review</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-600">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Verification Queue</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'pending_review').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Under Review</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'under_review').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.filter(p => p.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects by name or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects List */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Projects Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? 'border-green-600 bg-green-900/20'
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-gray-400 mb-2">{project.organization}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.submittedDate}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Expected Credits: {project.expectedCredits.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Panel */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedProject ? 'Review Project' : 'Select a project to review'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{selectedProject.name}</h3>
                    <p className="text-gray-400 mb-4">{selectedProject.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-400">Organization:</span>
                        <p className="text-white">{selectedProject.organization}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <p className="text-white">{selectedProject.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <p className="text-white">{selectedProject.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Expected Credits:</span>
                        <p className="text-white">{selectedProject.expectedCredits.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Submitted Documents:</h4>
                      <div className="space-y-1">
                        {selectedProject.documents.map((doc: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-blue-400">
                            <FileText className="w-4 h-4 mr-2" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(selectedProject.status === 'pending_review' || selectedProject.status === 'under_review') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Approved Credits (if different from requested)
                        </label>
                        <Input
                          type="number"
                          value={approvedCredits}
                          onChange={(e) => setApprovedCredits(e.target.value)}
                          placeholder={selectedProject.expectedCredits.toString()}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Review Notes
                        </label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add any comments or requirements for the project..."
                          rows={4}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(selectedProject.id)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Project
                        </Button>
                        <Button
                          onClick={() => handleReject(selectedProject.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Project
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedProject.status === 'approved' && (
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                      <div className="flex items-center text-green-400 mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Project Approved</span>
                      </div>
                      <p className="text-green-300 text-sm">
                        This project has been approved and carbon credits have been issued.
                      </p>
                    </div>
                  )}

                  {selectedProject.status === 'rejected' && (
                    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                      <div className="flex items-center text-red-400 mb-2">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Project Rejected</span>
                      </div>
                      <p className="text-red-300 text-sm">
                        This project has been rejected. The organization can resubmit with corrections.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a project from the queue to begin review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
