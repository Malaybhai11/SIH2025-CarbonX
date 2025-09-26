"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  BarChart3,
  Plus,
  Download,
  Eye
} from "lucide-react";

// Mock data - in real app this would come from API
const mockUploads = [
  {
    id: "1",
    projectName: "Amazon Rainforest Protection",
    type: "monitoring_report",
    title: "Q4 2024 Monitoring Report",
    description: "Carbon sequestration measurements and biodiversity assessment",
    uploadDate: "2024-01-15",
    status: "verified",
    fileName: "monitoring_q4_2024.pdf",
    fileSize: "2.4 MB",
    verifiedDate: "2024-01-18"
  },
  {
    id: "2",
    projectName: "Solar Farm Development",
    type: "sensor_data",
    title: "Energy Generation Data - December 2024",
    description: "Monthly solar panel output and efficiency metrics",
    uploadDate: "2024-01-20",
    status: "under_review",
    fileName: "solar_data_dec_2024.csv",
    fileSize: "1.8 MB"
  },
  {
    id: "3",
    projectName: "Mangrove Restoration",
    type: "satellite_imagery",
    title: "Aerial Survey - Restoration Zone A",
    description: "High-resolution satellite images showing mangrove growth",
    uploadDate: "2024-01-22",
    status: "pending",
    fileName: "satellite_images_zone_a.zip",
    fileSize: "45.2 MB"
  }
];

const uploadTypes = [
  { value: "monitoring_report", label: "Monitoring Report", description: "Regular MRV reports and assessments" },
  { value: "sensor_data", label: "Sensor Data", description: "IoT sensor readings and measurements" },
  { value: "satellite_imagery", label: "Satellite Imagery", description: "Aerial and satellite photographs" },
  { value: "field_observations", label: "Field Observations", description: "Manual field data and observations" },
  { value: "financial_report", label: "Financial Report", description: "Project expenditure and budget reports" },
  { value: "other", label: "Other Documentation", description: "Additional project documentation" }
];

export default function DataUploads() {
  const { user } = useUser();
  const router = useRouter();
  const [uploads, setUploads] = useState(mockUploads);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "organization") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedProject || !uploadType || !title || uploadedFiles.length === 0) {
      alert("Please fill in all required fields and upload at least one file");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add new upload to list
    const newUpload = {
      id: Date.now().toString(),
      projectName: selectedProject,
      type: uploadType,
      title,
      description,
      uploadDate: new Date().toISOString().split('T')[0],
      status: "pending" as const,
      fileName: uploadedFiles[0].name,
      fileSize: `${(uploadedFiles[0].size / 1024 / 1024).toFixed(1)} MB`
    };

    setUploads(prev => [newUpload, ...prev]);
    setIsSubmitting(false);
    setShowUploadForm(false);
    setSelectedProject("");
    setUploadType("");
    setTitle("");
    setDescription("");
    setUploadedFiles([]);
  };

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

  const getTypeLabel = (type: string) => {
    return uploadTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">MRV Data Uploads</h1>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Upload MRV Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Project *</label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Amazon Rainforest Protection">Amazon Rainforest Protection</SelectItem>
                      <SelectItem value="Solar Farm Development">Solar Farm Development</SelectItem>
                      <SelectItem value="Mangrove Restoration">Mangrove Restoration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Upload Type *</label>
                  <Select value={uploadType} onValueChange={setUploadType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select upload type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {uploadTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-400">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for this upload"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the data being uploaded"
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Upload Files *</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Upload monitoring reports, sensor data, satellite imagery, or other documentation
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.png,.tif,.tiff,.zip"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Files to Upload:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <span className="text-white">{file.name}</span>
                          <div className="text-sm text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Uploading..." : "Upload Data"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploads List */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{upload.title}</h3>
                      <p className="text-gray-400 mb-2">{upload.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{upload.projectName}</span>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(upload.type)}
                        </Badge>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {upload.uploadDate}
                        </span>
                        <span>{upload.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getStatusBadge(upload.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MRV Guidelines */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">MRV Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadTypes.map((type) => (
                <div key={type.value} className="p-4 border border-gray-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{type.label}</h4>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Accepted formats: PDF, DOC, XLS, CSV, JPG, PNG, ZIP
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
