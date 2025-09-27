"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Download,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Leaf,
  Building2,
  Target,
  TrendingUp,
  Users,
  Globe,
  Calculator,
  Image as ImageIcon,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  RotateCcw,
  Star,
  MessageSquare,
  History,
  Shield,
  Award
} from "lucide-react";

// Mock detailed project data
const mockProject = {
  id: "proj_001",
  name: "Amazon Rainforest Carbon Sequestration Initiative",
  organization: {
    name: "GreenTech Solutions Ltd.",
    type: "Non-Profit Organization",
    registration: "NGO-BR-2019-4521",
    established: "2019",
    headquarters: "São Paulo, Brazil",
    website: "https://greentech-solutions.org",
    contact: {
      primaryContact: "Dr. Maria Santos",
      email: "maria.santos@greentech-solutions.org",
      phone: "+55 11 3456-7890"
    }
  },
  status: "under_review",
  submittedDate: "2024-01-15T10:30:00Z",
  lastModified: "2024-01-18T14:22:00Z",
  projectDetails: {
    type: "Reforestation",
    methodology: "VM0005 - Improved Forest Management",
    version: "v2.1",
    location: {
      country: "Brazil",
      state: "Amazonas",
      coordinates: "-3.4653, -62.2159",
      area: "15,420 hectares",
      biodiversityRating: "Critical"
    },
    timeline: {
      startDate: "2024-03-01",
      endDate: "2034-02-28",
      creditingPeriod: "10 years",
      monitoringFrequency: "Annual"
    },
    expectedCredits: 85000,
    estimatedAnnualCredits: 8500,
    baselineScenario: "Continued deforestation at historical rate of 2.3% annually",
    additionality: "Project would not occur without carbon credit revenue"
  },
  technicalDetails: {
    species: ["Cecropia obtusa", "Bertholletia excelsa", "Swietenia macrophylla"],
    plantingDensity: "400 trees per hectare",
    survivalRate: "85%",
    carbonSequestrationRate: "5.5 tCO2e per hectare per year",
    biodiversityBenefits: "Habitat for 247 recorded species including endangered jaguars",
    communityBenefits: "Employment for 120 local families, sustainable harvesting rights"
  },
  documents: [
    {
      id: "doc_001",
      name: "Project Design Document (PDD)",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "verified",
      url: "/documents/pdd_amazon_project.pdf"
    },
    {
      id: "doc_002",
      name: "Environmental Impact Assessment",
      type: "pdf",
      size: "1.8 MB",
      uploadDate: "2024-01-15",
      status: "verified",
      url: "/documents/eia_amazon_project.pdf"
    },
    {
      id: "doc_003",
      name: "Community Consultation Report",
      type: "pdf",
      size: "950 KB",
      uploadDate: "2024-01-16",
      status: "pending",
      url: "/documents/community_report.pdf"
    },
    {
      id: "doc_004",
      name: "Baseline Study",
      type: "pdf",
      size: "3.1 MB",
      uploadDate: "2024-01-16",
      status: "verified",
      url: "/documents/baseline_study.pdf"
    },
    {
      id: "doc_005",
      name: "Monitoring Plan",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2024-01-17",
      status: "verified",
      url: "/documents/monitoring_plan.pdf"
    }
  ],
  media: [
    {
      id: "media_001",
      name: "Project Site Overview",
      type: "image",
      url: "/images/site_overview.jpg",
      description: "Aerial view of the project area showing current forest cover"
    },
    {
      id: "media_002",
      name: "Community Engagement Video",
      type: "video",
      url: "/videos/community_engagement.mp4",
      description: "Local community leaders discussing project benefits"
    },
    {
      id: "media_003",
      name: "Biodiversity Survey",
      type: "image",
      url: "/images/biodiversity.jpg",
      description: "Endemic species identified during baseline surveys"
    }
  ],
  verification: {
    thirdPartyValidator: "Climate Action Reserve",
    validationStatus: "In Progress",
    validationDate: "2024-01-20",
    certifications: ["FSC Certified", "CCBS Gold Standard"],
    riskAssessment: {
      permanence: "Medium",
      leakage: "Low",
      additionality: "High",
      overall: "Medium-High"
    }
  },
  financials: {
    totalProjectCost: "$2,400,000",
    carbonRevenue: "$1,530,000",
    otherFunding: "$870,000",
    costPerCredit: "$28.24",
    expectedROI: "18.5%",
    paymentSchedule: "Quarterly upon verification"
  },
  reviews: [
    {
      id: "rev_001",
      reviewer: "Dr. James Wilson",
      role: "Senior Carbon Analyst",
      date: "2024-01-18T09:15:00Z",
      rating: 4,
      comments: "Comprehensive documentation with strong community engagement. Recommend minor revisions to monitoring protocol.",
      areas: ["Documentation Quality", "Community Engagement", "Technical Feasibility"]
    },
    {
      id: "rev_002",
      reviewer: "Sarah Martinez",
      role: "Environmental Specialist",
      date: "2024-01-17T16:45:00Z",
      rating: 5,
      comments: "Excellent biodiversity co-benefits and robust baseline methodology. Project aligns with conservation priorities.",
      areas: ["Environmental Impact", "Baseline Methodology", "Biodiversity Benefits"]
    }
  ],
  timeline: [
    {
      date: "2024-01-15T10:30:00Z",
      event: "Project Submitted",
      user: "Maria Santos (GreenTech Solutions)",
      description: "Initial project submission with all required documents"
    },
    {
      date: "2024-01-16T14:20:00Z",
      event: "Document Review Started",
      user: "System",
      description: "Automated document verification process initiated"
    },
    {
      date: "2024-01-17T11:45:00Z",
      event: "Technical Review Assigned",
      user: "Dr. James Wilson",
      description: "Project assigned to senior carbon analyst for technical review"
    },
    {
      date: "2024-01-18T09:15:00Z",
      event: "Review Comments Added",
      user: "Dr. James Wilson",
      description: "Initial technical review completed with recommendations"
    }
  ]
};

export default function ProjectReview() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const [project] = useState(mockProject);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvedCredits, setApprovedCredits] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

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

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600 text-xs">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-xs">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 text-xs">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-600 text-xs">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return <Badge className="bg-green-600 text-xs">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600 text-xs">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-600 text-xs">High Risk</Badge>;
      case "medium-high":
        return <Badge className="bg-orange-600 text-xs">Medium-High Risk</Badge>;
      default:
        return <Badge className="bg-gray-600 text-xs">{risk}</Badge>;
    }
  };

  const handleApprove = () => {
    // Implementation for project approval
    console.log("Approving project with:", { reviewNotes, approvedCredits });
  };

  const handleReject = () => {
    // Implementation for project rejection
    console.log("Rejecting project with notes:", reviewNotes);
  };

  const handleRequestRevisions = () => {
    // Implementation for requesting revisions
    console.log("Requesting revisions:", reviewNotes);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queue
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(project.status)}
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">ID: {project.id}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Submitted {new Date(project.submittedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Export Details
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-400" />
                      Project Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Project Type</p>
                        <p className="text-white font-medium">{project.projectDetails.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Methodology</p>
                        <p className="text-white font-medium">{project.projectDetails.methodology}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">{project.projectDetails.location.state}, {project.projectDetails.location.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Project Area</p>
                        <p className="text-white font-medium">{project.projectDetails.location.area}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Timeline</p>
                        <p className="text-white font-medium">{project.projectDetails.timeline.creditingPeriod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Expected Credits</p>
                        <p className="text-white font-medium">{project.projectDetails.expectedCredits.toLocaleString()} tCO₂e</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm text-gray-400 mb-2">Project Description</p>
                      <p className="text-gray-300">
                        This large-scale reforestation project focuses on restoring degraded forest lands in the Amazon basin. 
                        The initiative involves planting native tree species across {project.projectDetails.location.area} to 
                        sequester carbon dioxide while providing significant biodiversity and community benefits. The project 
                        employs sustainable forest management practices and engages local communities through employment 
                        opportunities and capacity building programs.
                      </p>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-gray-400 mb-2">Baseline Scenario</p>
                      <p className="text-gray-300">{project.projectDetails.baselineScenario}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Additionality</p>
                      <p className="text-gray-300">{project.projectDetails.additionality}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental & Social Impact */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-400" />
                      Environmental & Social Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Leaf className="w-4 h-4 mr-2 text-green-400" />
                          Biodiversity Benefits
                        </h4>
                        <p className="text-gray-300 text-sm">{project.technicalDetails.biodiversityBenefits}</p>
                        <Badge className="bg-green-900/50 text-green-300 mt-2">
                          {project.projectDetails.location.biodiversityRating} Biodiversity Area
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-purple-400" />
                          Community Benefits
                        </h4>
                        <p className="text-gray-300 text-sm">{project.technicalDetails.communityBenefits}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">{project.technicalDetails.carbonSequestrationRate}</p>
                        <p className="text-sm text-gray-400">tCO₂e/ha/year</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-400">{project.technicalDetails.survivalRate}</p>
                        <p className="text-sm text-gray-400">Survival Rate</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-400">{project.technicalDetails.species.length}</p>
                        <p className="text-sm text-gray-400">Tree Species</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Organization & Contact Info */}
              <div className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{project.organization.name}</p>
                      <p className="text-gray-400">{project.organization.type}</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-400">Registration</p>
                        <p className="text-white">{project.organization.registration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Established</p>
                        <p className="text-white">{project.organization.established}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Headquarters</p>
                        <p className="text-white">{project.organization.headquarters}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Website</p>
                        <a href={project.organization.website} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                          {project.organization.website}
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                      <h4 className="text-white font-medium mb-3">Primary Contact</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-white">{project.organization.contact.primaryContact}</p>
                        <p className="text-gray-400">{project.organization.contact.email}</p>
                        <p className="text-gray-400">{project.organization.contact.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-400" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <p className="text-lg font-bold text-green-400">{project.projectDetails.expectedCredits.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Total Credits</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <p className="text-lg font-bold text-blue-400">{project.projectDetails.estimatedAnnualCredits.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Annual Credits</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Project Cost</span>
                        <span className="text-white">{project.financials.totalProjectCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost per Credit</span>
                        <span className="text-white">{project.financials.costPerCredit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected ROI</span>
                        <span className="text-green-400">{project.financials.expectedROI}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-400" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Methodology Version</p>
                      <p className="text-white font-medium">{project.projectDetails.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Planting Density</p>
                      <p className="text-white font-medium">{project.technicalDetails.plantingDensity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Monitoring Frequency</p>
                      <p className="text-white font-medium">{project.projectDetails.timeline.monitoringFrequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Coordinates</p>
                      <p className="text-white font-medium">{project.projectDetails.location.coordinates}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Selected Tree Species</h4>
                    <div className="space-y-2">
                      {project.technicalDetails.species.map((species, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 italic">{species}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Carbon Calculations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-300 font-medium">Total Expected Sequestration</span>
                        <span className="text-green-300 font-bold">{project.projectDetails.expectedCredits.toLocaleString()} tCO₂e</span>
                      </div>
                      <div className="text-sm text-green-400">Over {project.projectDetails.timeline.creditingPeriod}</div>
                    </div>

                    <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-300 font-medium">Annual Sequestration Rate</span>
                        <span className="text-blue-300 font-bold">{project.projectDetails.estimatedAnnualCredits.toLocaleString()} tCO₂e/year</span>
                      </div>
                      <div className="text-sm text-blue-400">Per hectare: {project.technicalDetails.carbonSequestrationRate}</div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <h5 className="text-white font-medium">Calculation Methodology</h5>
                      <div className="text-sm text-gray-300 space-y-2">
                        <p>• Baseline emissions calculated using historical deforestation data</p>
                        <p>• Project emissions estimated from land use change and monitoring activities</p>
                        <p>• Leakage assessment conducted for surrounding areas</p>
                        <p>• Uncertainty deductions applied as per methodology requirements</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Timeline */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white font-medium">{new Date(project.projectDetails.timeline.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-white font-medium">{new Date(project.projectDetails.timeline.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Crediting Period</p>
                    <p className="text-white font-medium">{project.projectDetails.timeline.creditingPeriod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Monitoring</p>
                    <p className="text-white font-medium">{project.projectDetails.timeline.monitoringFrequency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Project Documents ({project.documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {project.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedDocument?.id === doc.id
                              ? 'border-blue-600 bg-blue-900/20'
                              : 'border-gray-800 hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{doc.name}</h4>
                            {getDocumentStatusBadge(doc.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {doc.type.toUpperCase()}
                            </span>
                            <span>{doc.size}</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                          {doc.status === 'verified' && (
                            <div className="mt-2 text-sm text-green-400">
                              ✓ Verified and compliant
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-400" />
                    Document Viewer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDocument ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{selectedDocument.name}</h4>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                        <div className="text-gray-400">
                          <FileText className="w-12 h-12 mx-auto mb-4" />
                          <p>PDF Viewer Placeholder</p>
                          <p className="text-sm mt-2">Click download to view full document</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>Size: {selectedDocument.size}</p>
                        <p>Uploaded: {new Date(selectedDocument.uploadDate).toLocaleDateString()}</p>
                        <p>Status: {selectedDocument.status}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Select a document to preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Media Gallery */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-purple-400" />
                  Project Media ({project.media.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.media.map((media, index) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <div className="w-full h-full bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium">{media.name}</p>
                        <p className="text-gray-400 text-xs">{media.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-400" />
                    Third-Party Validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Validator</p>
                      <p className="text-white font-medium">{project.verification.thirdPartyValidator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <Badge className="bg-yellow-600">{project.verification.validationStatus}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Validation Date</p>
                      <p className="text-white font-medium">{new Date(project.verification.validationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Certifications</p>
                      <div className="space-y-1">
                        {project.verification.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-600 text-green-300">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Permanence Risk</span>
                      {getRiskBadge(project.verification.riskAssessment.permanence)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Leakage Risk</span>
                      {getRiskBadge(project.verification.riskAssessment.leakage)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Additionality</span>
                      {getRiskBadge(project.verification.riskAssessment.additionality)}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <span className="text-white font-medium">Overall Risk</span>
                      {getRiskBadge(project.verification.riskAssessment.overall)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Previous Reviews */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-5 h-5 mr-2 text-green-400" />
                  Review History ({project.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {review.reviewer.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{review.reviewer}</p>
                            <p className="text-gray-400 text-sm">{review.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{review.comments}</p>
                      <div className="flex gap-2">
                        {review.areas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-600 text-blue-300">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Project Economics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Project Cost</p>
                      <p className="text-2xl font-bold text-white">{project.financials.totalProjectCost}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected Carbon Revenue</p>
                      <p className="text-2xl font-bold text-green-400">{project.financials.carbonRevenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Other Funding</p>
                      <p className="text-xl font-bold text-blue-400">{project.financials.otherFunding}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected ROI</p>
                      <p className="text-xl font-bold text-green-400">{project.financials.expectedROI}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Cost per Credit</span>
                      <span className="text-white font-bold">{project.financials.costPerCredit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Payment Schedule</span>
                      <span className="text-white">{project.financials.paymentSchedule}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-400" />
                    Financial Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Carbon Credit Revenue</span>
                        <span className="text-green-400 font-medium">63.8%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '63.8%' }} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Other Funding Sources</span>
                        <span className="text-blue-400 font-medium">36.2%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '36.2%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-300">
                    <p className="mb-2"><strong>Funding Sources:</strong></p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Government grants: $420,000</li>
                      <li>• Private investment: $350,000</li>
                      <li>• Organization funds: $100,000</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Review Form */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                    Submit Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Approved Credits (if different from requested: {project.projectDetails.expectedCredits.toLocaleString()})
                    </label>
                    <Input
                      type="number"
                      value={approvedCredits}
                      onChange={(e) => setApprovedCredits(e.target.value)}
                      placeholder={project.projectDetails.expectedCredits.toString()}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Review Comments & Recommendations
                    </label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Provide detailed feedback on the project submission, including any requirements for approval or reasons for rejection..."
                      rows={6}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleApprove}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Project
                    </Button>
                    <Button
                      onClick={handleRequestRevisions}
                      variant="outline"
                      className="w-full border-yellow-600 text-yellow-300 hover:bg-yellow-900/20"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Request Revisions
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Project
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <History className="w-5 h-5 mr-2 text-purple-400" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {project.timeline.map((activity, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            {index < project.timeline.length - 1 && (
                              <div className="w-px h-12 bg-gray-700 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium">{activity.event}</h4>
                              <span className="text-gray-400 text-sm">
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{activity.description}</p>
                            <p className="text-gray-500 text-xs">by {activity.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
