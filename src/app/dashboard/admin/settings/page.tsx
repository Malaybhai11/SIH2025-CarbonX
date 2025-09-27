"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Mail,
  Palette,
  Key,
  Users,
  FileText,
  Activity,
  Zap,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Unlock,
  Clock,
  DollarSign,
  Calendar,
  Target,
  Leaf,
  Building2,
  MapPin,
  Phone,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react";

// Mock settings data
const mockSettings = {
  system: {
    platformName: "Carbon Credit Registry",
    version: "2.1.4",
    environment: "Production",
    region: "US-East-1",
    timezone: "UTC-5 (EST)",
    language: "English",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    maxFileSize: 50,
    sessionTimeout: 3600
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    projectSubmissions: true,
    projectApprovals: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    securityAlerts: true,
    digestFrequency: "daily"
  },
  security: {
    twoFactorAuth: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    sessionSecurity: "high",
    ipWhitelisting: false,
    auditLogging: true,
    encryptionLevel: "AES-256",
    backupFrequency: "daily",
    lastSecurityScan: "2024-01-20T09:30:00Z"
  },
  integrations: {
    supabaseConnected: true,
    clerkConnected: true,
    emailService: "SendGrid",
    storageService: "AWS S3",
    analyticsService: "Google Analytics",
    paymentGateway: "Stripe",
    blockchainNetwork: "Ethereum",
    externalAPIs: ["Carbon Registry API", "Satellite Data API", "Weather API"]
  },
  carbonSettings: {
    defaultMethodology: "VM0005",
    creditValidityPeriod: 10,
    minimumProjectSize: 1000,
    maxCreditsPerProject: 1000000,
    approvalWorkflow: "three-tier",
    verificationRequired: true,
    automaticRetirement: false,
    fractionalCredits: true,
    creditPrecision: 2
  },
  users: {
    totalUsers: 1247,
    activeUsers: 892,
    adminUsers: 8,
    organizationUsers: 156,
    individualUsers: 1083,
    registrationEnabled: true,
    emailVerificationRequired: true,
    defaultRole: "local",
    maxUsersPerOrg: 50
  }
};

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(mockSettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState("2024-01-20T15:30:00Z");

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUnsavedChanges(false);
    setLastSaved(new Date().toISOString());
    setLoading(false);
  };

  const handleReset = () => {
    setSettings(mockSettings);
    setUnsavedChanges(false);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const generateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // In real app, this would make an API call
    console.log('Generated new API key:', newKey);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
            <p className="text-gray-400 mt-1">Configure and manage your carbon credit platform</p>
            {lastSaved && (
              <p className="text-sm text-gray-500 mt-1">
                Last saved: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {unsavedChanges && (
              <Button variant="outline" onClick={handleReset} className="border-gray-600 text-gray-300">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Changes
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              disabled={!unsavedChanges || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Alert */}
        {unsavedChanges && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center text-yellow-400">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-medium">You have unsaved changes</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">
              Don't forget to save your changes before leaving this page.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="carbon">Carbon Settings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-400" />
                    Platform Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platformName" className="text-white">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.system.platformName}
                      onChange={(e) => updateSetting('system', 'platformName', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version" className="text-white">Version</Label>
                      <Input
                        id="version"
                        value={settings.system.version}
                        disabled
                        className="bg-gray-800 border-gray-700 text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="environment" className="text-white">Environment</Label>
                      <Input
                        id="environment"
                        value={settings.system.environment}
                        disabled
                        className="bg-gray-800 border-gray-700 text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white">Default Timezone</Label>
                    <Select value={settings.system.timezone} onValueChange={(value) => updateSetting('system', 'timezone', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="UTC-5 (EST)">UTC-5 (EST)</SelectItem>
                        <SelectItem value="UTC-8 (PST)">UTC-8 (PST)</SelectItem>
                        <SelectItem value="UTC+0 (GMT)">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+1 (CET)">UTC+1 (CET)</SelectItem>
                        <SelectItem value="UTC+8 (CST)">UTC+8 (CST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-white">Default Language</Label>
                      <Select value={settings.system.language} onValueChange={(value) => updateSetting('system', 'language', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Portuguese">Portuguese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-white">Default Currency</Label>
                      <Select value={settings.system.currency} onValueChange={(value) => updateSetting('system', 'currency', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="BRL">BRL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit" className="text-white">API Rate Limit (requests/hour)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={settings.system.apiRateLimit}
                      onChange={(e) => updateSetting('system', 'apiRateLimit', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize" className="text-white">Max File Upload Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.system.maxFileSize}
                      onChange={(e) => updateSetting('system', 'maxFileSize', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-white">Session Timeout (seconds)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.system.sessionTimeout}
                      onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Maintenance Mode</Label>
                        <p className="text-sm text-gray-400">Disable public access for maintenance</p>
                      </div>
                      <Switch
                        checked={settings.system.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('system', 'maintenanceMode', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Debug Mode</Label>
                        <p className="text-sm text-gray-400">Enable detailed error logging</p>
                      </div>
                      <Switch
                        checked={settings.system.debugMode}
                        onCheckedChange={(checked) => updateSetting('system', 'debugMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white font-medium">Database</p>
                    <p className="text-sm text-green-400">Operational</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white font-medium">API</p>
                    <p className="text-sm text-green-400">Operational</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <p className="text-white font-medium">Storage</p>
                    <p className="text-sm text-yellow-400">High Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white font-medium">CDN</p>
                    <p className="text-sm text-green-400">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-400" />
                    Authentication & Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-400">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry" className="text-white">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className="text-white">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionSecurity" className="text-white">Session Security Level</Label>
                    <Select value={settings.security.sessionSecurity} onValueChange={(value) => updateSetting('security', 'sessionSecurity', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">IP Whitelisting</Label>
                      <p className="text-sm text-gray-400">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch
                      checked={settings.security.ipWhitelisting}
                      onCheckedChange={(checked) => updateSetting('security', 'ipWhitelisting', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Key className="w-5 h-5 mr-2 text-yellow-400" />
                    API Keys & Encryption
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Master API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value="sk_1234567890abcdef1234567890abcdef"
                        disabled
                        className="bg-gray-800 border-gray-700 text-gray-400 flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="border-gray-600"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateApiKey}
                        className="border-gray-600"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encryptionLevel" className="text-white">Encryption Level</Label>
                    <Select value={settings.security.encryptionLevel} onValueChange={(value) => updateSetting('security', 'encryptionLevel', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="AES-128">AES-128</SelectItem>
                        <SelectItem value="AES-256">AES-256</SelectItem>
                        <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency" className="text-white">Backup Frequency</Label>
                    <Select value={settings.security.backupFrequency} onValueChange={(value) => updateSetting('security', 'backupFrequency', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Audit Logging</Label>
                      <p className="text-sm text-gray-400">Log all administrative actions</p>
                    </div>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => updateSetting('security', 'auditLogging', checked)}
                    />
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <div className="flex items-center text-blue-400 mb-2">
                      <Info className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Last Security Scan</span>
                    </div>
                    <p className="text-blue-300 text-sm">
                      {new Date(settings.security.lastSecurityScan).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-400" />
                    Notification Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">SMS Notifications</Label>
                      <p className="text-sm text-gray-400">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Push Notifications</Label>
                      <p className="text-sm text-gray-400">Send browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="digestFrequency" className="text-white">Digest Frequency</Label>
                    <Select value={settings.notifications.digestFrequency} onValueChange={(value) => updateSetting('notifications', 'digestFrequency', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-400" />
                    Notification Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Project Submissions</Label>
                      <p className="text-sm text-gray-400">New project submissions</p>
                    </div>
                    <Switch
                      checked={settings.notifications.projectSubmissions}
                      onCheckedChange={(checked) => updateSetting('notifications', 'projectSubmissions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Project Approvals</Label>
                      <p className="text-sm text-gray-400">Project approval notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.projectApprovals}
                      onCheckedChange={(checked) => updateSetting('notifications', 'projectApprovals', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">System Alerts</Label>
                      <p className="text-sm text-gray-400">Critical system notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Security Alerts</Label>
                      <p className="text-sm text-gray-400">Security-related notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.securityAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'securityAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Weekly Reports</Label>
                      <p className="text-sm text-gray-400">Weekly analytics reports</p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Monthly Reports</Label>
                      <p className="text-sm text-gray-400">Monthly summary reports</p>
                    </div>
                    <Switch
                      checked={settings.notifications.monthlyReports}
                      onCheckedChange={(checked) => updateSetting('notifications', 'monthlyReports', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Connected Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Supabase</p>
                          <p className="text-sm text-gray-400">Database & Authentication</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Clerk</p>
                          <p className="text-sm text-gray-400">User Authentication</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">SendGrid</p>
                          <p className="text-sm text-gray-400">Email Service</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">AWS S3</p>
                          <p className="text-sm text-gray-400">File Storage</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Google Analytics</p>
                          <p className="text-sm text-gray-400">Analytics Service</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Stripe</p>
                          <p className="text-sm text-gray-400">Payment Gateway</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Ethereum</p>
                          <p className="text-sm text-gray-400">Blockchain Network</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-600">Testing</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Weather API</p>
                          <p className="text-sm text-gray-400">Environmental Data</p>
                        </div>
                      </div>
                      <Badge className="bg-gray-600">Inactive</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Carbon Settings */}
          <TabsContent value="carbon" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-400" />
                    Carbon Credit Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultMethodology" className="text-white">Default Methodology</Label>
                    <Select value={settings.carbonSettings.defaultMethodology} onValueChange={(value) => updateSetting('carbonSettings', 'defaultMethodology', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="VM0005">VM0005 - Improved Forest Management</SelectItem>
                        <SelectItem value="VM0007">VM0007 - REDD+ Methodology Framework</SelectItem>
                        <SelectItem value="ACM0002">ACM0002 - Grid-connected electricity generation</SelectItem>
                        <SelectItem value="AMS-I.D">AMS-I.D - Grid connected renewable electricity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creditValidityPeriod" className="text-white">Credit Validity Period (years)</Label>
                    <Input
                      id="creditValidityPeriod"
                      type="number"
                      value={settings.carbonSettings.creditValidityPeriod}
                      onChange={(e) => updateSetting('carbonSettings', 'creditValidityPeriod', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minimumProjectSize" className="text-white">Min Project Size (tCO₂e)</Label>
                      <Input
                        id="minimumProjectSize"
                        type="number"
                        value={settings.carbonSettings.minimumProjectSize}
                        onChange={(e) => updateSetting('carbonSettings', 'minimumProjectSize', parseInt(e.target.value))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxCreditsPerProject" className="text-white">Max Credits per Project</Label>
                      <Input
                        id="maxCreditsPerProject"
                        type="number"
                        value={settings.carbonSettings.maxCreditsPerProject}
                        onChange={(e) => updateSetting('carbonSettings', 'maxCreditsPerProject', parseInt(e.target.value))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvalWorkflow" className="text-white">Approval Workflow</Label>
                    <Select value={settings.carbonSettings.approvalWorkflow} onValueChange={(value) => updateSetting('carbonSettings', 'approvalWorkflow', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="single-tier">Single-tier (Admin only)</SelectItem>
                        <SelectItem value="two-tier">Two-tier (Review + Admin)</SelectItem>
                        <SelectItem value="three-tier">Three-tier (Technical + Review + Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                    Credit Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Third-party Verification Required</Label>
                      <p className="text-sm text-gray-400">Require external verification for all projects</p>
                    </div>
                    <Switch
                      checked={settings.carbonSettings.verificationRequired}
                      onCheckedChange={(checked) => updateSetting('carbonSettings', 'verificationRequired', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Automatic Retirement</Label>
                      <p className="text-sm text-gray-400">Auto-retire credits after validity period</p>
                    </div>
                    <Switch
                      checked={settings.carbonSettings.automaticRetirement}
                      onCheckedChange={(checked) => updateSetting('carbonSettings', 'automaticRetirement', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Fractional Credits</Label>
                      <p className="text-sm text-gray-400">Allow fractional carbon credit amounts</p>
                    </div>
                    <Switch
                      checked={settings.carbonSettings.fractionalCredits}
                      onCheckedChange={(checked) => updateSetting('carbonSettings', 'fractionalCredits', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creditPrecision" className="text-white">Credit Precision (decimal places)</Label>
                    <Input
                      id="creditPrecision"
                      type="number"
                      min="0"
                      max="6"
                      value={settings.carbonSettings.creditPrecision}
                      onChange={(e) => updateSetting('carbonSettings', 'creditPrecision', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{settings.users.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Total Users</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{settings.users.activeUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-red-400">{settings.users.adminUsers}</p>
                      <p className="text-sm text-gray-400">Admin Users</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{settings.users.organizationUsers}</p>
                      <p className="text-sm text-gray-400">Organizations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-400" />
                    Registration Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">User Registration</Label>
                      <p className="text-sm text-gray-400">Allow new user registrations</p>
                    </div>
                    <Switch
                      checked={settings.users.registrationEnabled}
                      onCheckedChange={(checked) => updateSetting('users', 'registrationEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Verification Required</Label>
                      <p className="text-sm text-gray-400">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={settings.users.emailVerificationRequired}
                      onCheckedChange={(checked) => updateSetting('users', 'emailVerificationRequired', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultRole" className="text-white">Default User Role</Label>
                    <Select value={settings.users.defaultRole} onValueChange={(value) => updateSetting('users', 'defaultRole', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="local">Local Contributor</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="verifier">Verifier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUsersPerOrg" className="text-white">Max Users per Organization</Label>
                    <Input
                      id="maxUsersPerOrg"
                      type="number"
                      value={settings.users.maxUsersPerOrg}
                      onChange={(e) => updateSetting('users', 'maxUsersPerOrg', parseInt(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
