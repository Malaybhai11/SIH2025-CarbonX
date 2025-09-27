"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Leaf,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Target,
  Award,
  Globe,
  Activity,
  Zap,
  TreePine,
  Droplets,
  Wind
} from "lucide-react";

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalCredits: 245600,
    creditsThisMonth: 18400,
    totalProjects: 47,
    activeContributors: 234,
    monthlyGrowth: 12.5,
    avgProjectSize: 5225
  },
  contributions: [
    { month: "Jan", count: 45, credits: 12500, impact: "high" },
    { month: "Feb", count: 52, credits: 15200, impact: "medium" },
    { month: "Mar", count: 68, credits: 18400, impact: "high" },
    { month: "Apr", count: 71, credits: 20100, impact: "high" },
    { month: "May", count: 59, credits: 16800, impact: "medium" },
    { month: "Jun", count: 83, credits: 22300, impact: "high" }
  ],
  projectTypes: [
    { type: "Reforestation", projects: 18, credits: 85400, color: "#10b981" },
    { type: "Renewable Energy", projects: 12, credits: 67200, color: "#f59e0b" },
    { type: "Ocean Protection", projects: 8, credits: 45600, color: "#3b82f6" },
    { type: "Soil Conservation", projects: 6, credits: 32100, color: "#8b5cf6" },
    { type: "Wildlife Protection", projects: 3, credits: 15300, color: "#ef4444" }
  ],
  geographicDistribution: [
    { region: "South America", projects: 15, credits: 82400, percentage: 33.6 },
    { region: "Asia Pacific", projects: 12, credits: 68200, percentage: 27.8 },
    { region: "Africa", projects: 9, credits: 45600, percentage: 18.6 },
    { region: "North America", projects: 7, credits: 32100, percentage: 13.1 },
    { region: "Europe", projects: 4, credits: 17300, percentage: 7.0 }
  ],
  topContributors: [
    { name: "Green Solutions Ltd", contributions: 28, credits: 45600, type: "organization" },
    { name: "EcoTech Innovations", contributions: 22, credits: 38200, type: "organization" },
    { name: "Maya Patel", contributions: 156, credits: 12800, type: "individual" },
    { name: "Carbon Warriors NGO", contributions: 19, credits: 34500, type: "organization" },
    { name: "Alex Chen", contributions: 134, credits: 9600, type: "individual" }
  ],
  impactMetrics: {
    co2Sequestered: 245600, // tonnes
    treesPlanted: 1890000,
    renewableEnergyGenerated: 450, // MWh
    wasteReduced: 2340, // tonnes
    waterConserved: 850000 // liters
  },
  recentActivity: [
    { id: 1, user: "Maya Patel", action: "submitted", target: "Mangrove Restoration Project", time: "2 hours ago", impact: "high" },
    { id: 2, user: "EcoTech", action: "completed", target: "Solar Farm Installation", time: "5 hours ago", impact: "high" },
    { id: 3, user: "Alex Chen", action: "verified", target: "Community Garden Initiative", time: "1 day ago", impact: "medium" },
    { id: 4, user: "Green Solutions", action: "submitted", target: "Ocean Cleanup Drive", time: "2 days ago", impact: "high" },
    { id: 5, user: "Carbon Warriors", action: "approved", target: "Forest Conservation Project", time: "3 days ago", impact: "high" }
  ]
};

export default function AnalyticsDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [analytics] = useState(mockAnalytics);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Comprehensive insights into carbon credit contributions and environmental impact</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Credits Issued</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.totalCredits)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+{analytics.overview.monthlyGrowth}%</span>
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
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{analytics.overview.totalProjects}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-sm text-blue-400">Avg {formatNumber(analytics.overview.avgProjectSize)} credits</span>
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
                  <p className="text-sm text-gray-400">Contributors</p>
                  <p className="text-2xl font-bold text-white">{analytics.overview.activeContributors}</p>
                  <div className="flex items-center mt-1">
                    <Users className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-sm text-purple-400">This month</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Monthly Credits</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.creditsThisMonth)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">Current month</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Trends */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Contribution Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.contributions.map((item, index) => {
                  const maxCredits = Math.max(...analytics.contributions.map(c => c.credits));
                  const height = (item.credits / maxCredits) * 200;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-400 mb-2">{formatNumber(item.credits)}</div>
                      <div 
                        className="bg-gradient-to-t from-green-600 to-green-400 rounded-t w-full transition-all hover:opacity-80"
                        style={{ height: `${height}px` }}
                      />
                      <div className="text-xs text-gray-400 mt-2">{item.month}</div>
                      <div className="text-xs text-gray-500">{item.count} contributions</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Project Type Distribution */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Project Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.projectTypes.map((type, index) => {
                  const totalCredits = analytics.projectTypes.reduce((sum, t) => sum + t.credits, 0);
                  const percentage = (type.credits / totalCredits) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: type.color }}
                        />
                        <div>
                          <p className="text-white font-medium">{type.type}</p>
                          <p className="text-sm text-gray-400">{type.projects} projects</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatNumber(type.credits)}</p>
                        <p className="text-sm text-gray-400">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact Metrics */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Leaf className="w-5 h-5 mr-2" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics.impactMetrics.co2Sequestered)}</p>
                <p className="text-sm text-gray-400">Tonnes CO₂ Sequestered</p>
              </div>
              <div className="text-center">
                <div className="bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <TreePine className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics.impactMetrics.treesPlanted)}</p>
                <p className="text-sm text-gray-400">Trees Planted</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white">{analytics.impactMetrics.renewableEnergyGenerated}</p>
                <p className="text-sm text-gray-400">MWh Clean Energy</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics.impactMetrics.waterConserved)}</p>
                <p className="text-sm text-gray-400">Liters Water Saved</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Wind className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics.impactMetrics.wasteReduced)}</p>
                <p className="text-sm text-gray-400">Tonnes Waste Reduced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.geographicDistribution.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{region.region}</span>
                      <span className="text-gray-400">{region.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{region.projects} projects</span>
                      <span>{formatNumber(region.credits)} credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{contributor.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={contributor.type === 'organization' ? 'default' : 'secondary'} className="text-xs">
                            {contributor.type}
                          </Badge>
                          <span className="text-sm text-gray-400">{contributor.contributions} contributions</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatNumber(contributor.credits)}</p>
                      <p className="text-sm text-gray-400">credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(activity.impact)}`} />
                    <div>
                      <p className="text-white">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-400"> {activity.action} </span>
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${
                      activity.impact === 'high' ? 'bg-green-600' : 
                      activity.impact === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}
                  >
                    {activity.impact} impact
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
