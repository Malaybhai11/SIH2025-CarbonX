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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload,
  MapPin,
  Camera,
  TreePine,
  Waves,
  Sun,
  FileText,
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const contributionTypes = [
  {
    value: "tree_planting",
    label: "Tree Planting",
    icon: TreePine,
    description: "Report tree planting activities and survival rates",
    color: "text-green-400"
  },
  {
    value: "mangrove_restoration",
    label: "Mangrove Restoration",
    icon: Waves,
    description: "Document mangrove planting and coastal protection work",
    color: "text-blue-400"
  },
  {
    value: "biodiversity_monitoring",
    label: "Biodiversity Monitoring",
    icon: Camera,
    description: "Report wildlife sightings and biodiversity observations",
    color: "text-purple-400"
  },
  {
    value: "environmental_impact",
    label: "Environmental Impact",
    icon: AlertCircle,
    description: "Report pollution, deforestation, or other environmental issues",
    color: "text-red-400"
  },
  {
    value: "renewable_energy",
    label: "Renewable Energy",
    icon: Sun,
    description: "Document solar, wind, or other renewable energy installations",
    color: "text-yellow-400"
  },
  {
    value: "other",
    label: "Other Contribution",
    icon: FileText,
    description: "Any other environmental data or observations",
    color: "text-gray-400"
  }
];

export default function ContributeData() {
  const { user } = useUser();
  const router = useRouter();
  const [contributionType, setContributionType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "local") {
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
    if (!contributionType || !title || !description || !location || !date) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setContributionType("");
      setTitle("");
      setDescription("");
      setLocation("");
      setCoordinates("");
      setDate("");
      setQuantity("");
      setUploadedFiles([]);
    }, 3000);
  };

  const getCurrentType = () => {
    return contributionTypes.find(type => type.value === contributionType);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Contribution Submitted!</h2>
              <p className="text-gray-400 mb-6">
                Thank you for your environmental contribution. Your data will be reviewed by our verification team
                and may help support carbon credit projects in your area.
              </p>
              <Button
                onClick={() => router.push('/dashboard/local')}
                className="bg-green-600 hover:bg-green-700"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Contribute Environmental Data</h1>
          <p className="text-gray-400">
            Share your local observations and help build accurate carbon credit projects
          </p>
        </div>

        {/* Contribution Type Selection */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">What would you like to contribute?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributionTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setContributionType(type.value)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    contributionType === type.value
                      ? 'border-green-600 bg-green-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <type.icon className={`w-8 h-8 mb-2 ${type.color}`} />
                  <h3 className="text-white font-medium mb-1">{type.label}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contribution Form */}
        {contributionType && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {getCurrentType() && React.createElement(getCurrentType()!.icon, {
                  className: `w-6 h-6 mr-2 ${getCurrentType()?.color}`
                })}
                {getCurrentType()?.label} Contribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title for your contribution"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Date *</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you observed or contributed to..."
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location *</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State, Country"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">GPS Coordinates (Optional)</label>
                  <Input
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    placeholder="Latitude, Longitude (e.g., 12.9716, 77.5946)"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {(contributionType === 'tree_planting' || contributionType === 'mangrove_restoration') && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Number of trees/saplings planted"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">Supporting Evidence</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Upload photos, videos, or documents as evidence
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".jpg,.png,.jpeg,.gif,.mp4,.pdf,.doc,.docx"
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
                  <h4 className="text-white font-medium">Uploaded Files:</h4>
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

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">Data Privacy & Verification</h4>
                    <p className="text-blue-300 text-sm">
                      Your contribution will be verified by our team. Location data helps validate environmental impact,
                      but your personal information remains private and secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Contribution
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/local')}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Contribution Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-2">What to Include:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Clear description of your observation</li>
                  <li>• Accurate location information</li>
                  <li>• Date and time of observation</li>
                  <li>• Supporting photos or documents</li>
                  <li>• Quantity measurements where applicable</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Data Quality:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Be as specific as possible</li>
                  <li>• Include GPS coordinates when available</li>
                  <li>• Upload clear, relevant photos</li>
                  <li>• Report accurate quantities</li>
                  <li>• Note any uncertainties</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
