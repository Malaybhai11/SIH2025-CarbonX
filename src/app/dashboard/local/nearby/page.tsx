"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  TreePine,
  Waves,
  Sun,
  Users,
  Calendar,
  Target,
  Search,
  Filter,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation
} from "lucide-react";

const projectStatuses = {
  active: { label: "Active", color: "bg-green-600", icon: CheckCircle },
  planning: { label: "Planning", color: "bg-blue-600", icon: Clock },
  verification: { label: "Verification", color: "bg-yellow-600", icon: AlertTriangle },
  completed: { label: "Completed", color: "bg-gray-600", icon: CheckCircle }
};

const projectTypes = [
  {
    value: "reforestation",
    label: "Reforestation",
    icon: TreePine,
    color: "text-green-400"
  },
  {
    value: "mangrove_restoration",
    label: "Mangrove Restoration", 
    icon: Waves,
    color: "text-blue-400"
  },
  {
    value: "renewable_energy",
    label: "Renewable Energy",
    icon: Sun,
    color: "text-yellow-400"
  },
  {
    value: "conservation",
    label: "Conservation",
    icon: Heart,
    color: "text-purple-400"
  }
];

// Mock data - replace with actual API call
const mockProjects = [
  {
    id: "1",
    title: "Urban Forest Expansion - Bangalore East",
    description: "Large-scale tree planting initiative to create carbon sinks in urban areas. Community-driven project with local schools and businesses.",
    type: "reforestation",
    status: "active",
    location: "Whitefield, Bangalore",
    distance: 2.3,
    targetCarbonCredits: 1500,
    currentProgress: 65,
    participants: 47,
    startDate: "2025-08-15",
    endDate: "2025-12-30",
    coordinator: "Green Earth NGO",
    requirements: ["Tree planting volunteers", "Monitoring support", "Photo documentation"],
    images: ["/api/placeholder/300/200"]
  },
  {
    id: "2", 
    title: "Mangrove Coastal Protection Project",
    description: "Restoration of mangrove ecosystems along the coast to protect against erosion and create marine habitats.",
    type: "mangrove_restoration",
    status: "planning",
    location: "Pondicherry Coast",
    distance: 4.7,
    targetCarbonCredits: 2200,
    currentProgress: 25,
    participants: 23,
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    coordinator: "Ocean Conservation Society",
    requirements: ["Marine biology expertise", "Community outreach", "Equipment support"],
    images: ["/api/placeholder/300/200"]
  },
  {
    id: "3",
    title: "Solar Community Initiative",
    description: "Installing solar panels in rural communities while providing training for local maintenance and carbon offset tracking.",
    type: "renewable_energy", 
    status: "verification",
    location: "Hosur, Tamil Nadu",
    distance: 6.1,
    targetCarbonCredits: 3000,
    currentProgress: 80,
    participants: 31,
    startDate: "2025-06-01",
    endDate: "2025-11-30",
    coordinator: "Rural Energy Collective",
    requirements: ["Technical verification", "Impact assessment", "Local training"],
    images: ["/api/placeholder/300/200"]
  },
  {
    id: "4",
    title: "Wildlife Corridor Conservation",
    description: "Protecting and restoring wildlife corridors to maintain biodiversity and forest connectivity for carbon sequestration.",
    type: "conservation",
    status: "active",
    location: "Bannerghatta, Bangalore",
    distance: 8.9,
    targetCarbonCredits: 1800,
    currentProgress: 45,
    participants: 19,
    startDate: "2025-07-20",
    endDate: "2026-01-15",
    coordinator: "Wildlife Protection Trust",
    requirements: ["Wildlife monitoring", "Habitat restoration", "Research support"],
    images: ["/api/placeholder/300/200"]
  }
];

export default function LocalProjects() {
  const { user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "local") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedProjects = filteredProjects.sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "progress":
        return b.currentProgress - a.currentProgress;
      case "participants":
        return b.participants - a.participants;
      case "carbon_credits":
        return b.targetCarbonCredits - a.targetCarbonCredits;
      default:
        return 0;
    }
  });

  const getProjectTypeInfo = (type: string) => {
    return projectTypes.find(pt => pt.value === type) || projectTypes[0];
  };

  const getStatusInfo = (status: string) => {
    return projectStatuses[status as keyof typeof projectStatuses] || projectStatuses.active;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Ongoing Nearby Projects</h1>
          <p className="text-gray-400">
            Discover and contribute to environmental projects in your area
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects, locations, or organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {projectTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(projectStatuses).map(([key, status]) => (
                    <SelectItem key={key} value={key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                  <SelectItem value="carbon_credits">Carbon Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-white text-xl font-bold">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Participants</p>
                  <p className="text-white text-xl font-bold">
                    {projects.reduce((sum, p) => sum + p.participants, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Carbon Credits Target</p>
                  <p className="text-white text-xl font-bold">
                    {(projects.reduce((sum, p) => sum + p.targetCarbonCredits, 0) / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Distance</p>
                  <p className="text-white text-xl font-bold">
                    {(projects.reduce((sum, p) => sum + p.distance, 0) / projects.length).toFixed(1)} km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedProjects.map((project) => {
            const typeInfo = getProjectTypeInfo(project.type);
            const statusInfo = getStatusInfo(project.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={project.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center`}>
                        <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg leading-tight">
                          {project.title}
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">
                          by {project.coordinator}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusInfo.color} text-white`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Location and Distance */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{project.distance} km away</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Progress</span>
                      <span className="text-white text-sm font-medium">{project.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.currentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-white font-semibold">{project.participants}</p>
                      <p className="text-gray-400 text-xs">Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{project.targetCarbonCredits.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Target Credits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">
                        {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <p className="text-gray-400 text-xs">Remaining</p>
                    </div>
                  </div>

                  {/* Requirements Tags */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Seeking:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.requirements.slice(0, 2).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {req}
                        </Badge>
                      ))}
                      {project.requirements.length > 2 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          +{project.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => router.push(`/dashboard/local/projects/${project.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={() => router.push(`/dashboard/local/contribute?project=${project.id}`)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Contribute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {sortedProjects.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms to find more projects.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-600/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Don't see a project in your area?
                </h3>
                <p className="text-gray-300">
                  Help start new environmental initiatives by contributing data and connecting with local organizations.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => router.push('/dashboard/local/contribute')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Contribute Data
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => router.push('/dashboard/local/propose-project')}
                >
                  Propose Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
