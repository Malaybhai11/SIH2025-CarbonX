"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Loader2,
  X,
  Plus
} from "lucide-react";

interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  location: string;
  coordinates: string;
  startDate: string;
  endDate: string;
  expectedCredits: string;
  methodology: string;
  baseline: string;
  monitoring: string;
}

interface UploadedFile {
  file: File;
  uploaded: boolean;
  url?: string;
  path?: string;
  error?: string;
}

const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  type: "",
  location: "",
  coordinates: "",
  startDate: "",
  endDate: "",
  expectedCredits: "",
  methodology: "",
  baseline: "",
  monitoring: ""
};

const projectTypes = [
  "Reforestation",
  "Afforestation", 
  "Renewable Energy",
  "Energy Efficiency",
  "Methane Capture",
  "Coastal Protection",
  "Soil Carbon",
  "Other"
];

const steps = [
  { id: 1, title: "Basic Information", description: "Project name and description" },
  { id: 2, title: "Project Details", description: "Type, location, and timeline" },
  { id: 3, title: "Technical Details", description: "Methodology and monitoring" },
  { id: 4, title: "Documentation", description: "Upload supporting documents" },
  { id: 5, title: "Review & Submit", description: "Review and submit project" }
];

export default function SubmitProject() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "organization") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // File validation function
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'csv'];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/csv'
    ];
    
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return `File "${file.name}" has an unsupported format. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, CSV`;
    }
    
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      // Some browsers don't set file.type properly, so we also check extension
      return `File "${file.name}" has an unsupported type.`;
    }
    
    return null;
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        file,
        uploaded: false
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (projectId: string): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];

    setIsUploading(true);
    const formData = new FormData();
    
    uploadedFiles.forEach(({ file }) => {
      formData.append('files', file);
    });
    formData.append('projectId', projectId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { files } = await response.json();
      
      // Update uploaded files state
      setUploadedFiles(prev => prev.map((uploadedFile, index) => ({
        ...uploadedFile,
        uploaded: true,
        url: files[index]?.url,
        path: files[index]?.path
      })));

      return files.map((file: any) => file.url);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate temporary project ID for file uploads
      const tempProjectId = `temp_${Date.now()}`;
      
      // Upload files first
      const fileUrls = await uploadFiles(tempProjectId);
      
      // Submit project data
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileUrls
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const { project } = await response.json();
      
      // Success
      alert('Project submitted successfully! You will be notified once it is reviewed.');
      router.push('/dashboard/organization');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.type && formData.location.trim() && formData.startDate && formData.endDate;
      case 3:
        return formData.methodology.trim() && formData.baseline.trim() && formData.monitoring.trim();
      case 4:
        return uploadedFiles.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Project Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Project Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your carbon credit project in detail"
                rows={6}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Project Type *</label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Coordinates (Optional)</label>
              <Input
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder="Latitude, Longitude (e.g., 40.7128, -74.0060)"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Date *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">End Date *</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Expected Carbon Credits</label>
              <Input
                type="number"
                value={formData.expectedCredits}
                onChange={(e) => handleInputChange('expectedCredits', e.target.value)}
                placeholder="Estimated credits to be generated"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Methodology *</label>
              <Textarea
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                placeholder="Describe the methodology used for carbon credit calculation"
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Baseline Scenario *</label>
              <Textarea
                value={formData.baseline}
                onChange={(e) => handleInputChange('baseline', e.target.value)}
                placeholder="Describe the baseline scenario without the project"
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Monitoring Plan *</label>
              <Textarea
                value={formData.monitoring}
                onChange={(e) => handleInputChange('monitoring', e.target.value)}
                placeholder="Describe how the project will be monitored and reported"
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Upload Supporting Documents *</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
                <p className={`mb-4 ${isDragging ? 'text-blue-300' : 'text-gray-400'}`}>
                  {isDragging ? 'Drop files here' : 'Click to upload or drag and drop files'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, CSV (Max: 10MB each)
                </p>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.csv"
                  className="hidden"
                />
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {uploadedFiles.length === 0 && (
              <div className="text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                Please upload at least one supporting document to continue.
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Uploaded Files ({uploadedFiles.length}):</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div 
                      key={`${uploadedFile.file.name}-${uploadedFile.file.size}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-white block truncate" title={uploadedFile.file.name}>
                            {uploadedFile.file.name}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {uploadedFile.file.type || 'Unknown type'}
                            </Badge>
                            {uploadedFile.uploaded && (
                              <Badge className="bg-green-600 text-xs">Uploaded</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0 ml-2"
                        type="button"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Project Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-white">{formData.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <p className="text-white">{formData.type}</p>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="text-white">{formData.location}</p>
                </div>
                <div>
                  <span className="text-gray-400">Expected Credits:</span>
                  <p className="text-white">{formData.expectedCredits || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Documents:</span>
                  <p className="text-white">{uploadedFiles.length} files</p>
                </div>
                <div>
                  <span className="text-gray-400">Timeline:</span>
                  <p className="text-white">{formData.startDate} to {formData.endDate}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white">{formData.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Ready to submit!</span>
              </div>
              <p className="text-green-300 text-sm mt-1">
                Your project will be reviewed by our verification team before being approved.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Submit Carbon Project</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Progress Bar */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-gray-400">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="mb-4" />

            <div className="flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    step.id <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">{steps[currentStep - 1].title}</CardTitle>
            <p className="text-gray-400">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-green-600 hover:bg-green-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading || !isStepValid()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading Files...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
