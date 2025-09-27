"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Leaf,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PiggyBank,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  TreePine,
  Droplets,
  Wind,
  Zap,
  RefreshCw,
  Heart,
  Coins,
  CreditCard,
  History,
  Eye,
  Gift,
  Users,
  Star,
  TrendingUpIcon,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  Calculator,
  Trophy
} from "lucide-react";

// Mock impact and earnings data for local user
const mockImpactData = {
  overview: {
    totalEarnings: 3450.75, // USD
    pendingPayments: 245.50,
    totalCreditsEarned: 138.5,
    creditValue: 24.92, // average USD per credit
    monthlyGrowth: 18.7,
    earningsGrowth: 12.4,
    impactScore: 87.3, // out of 100
    carbonFootprintReduced: 12.6 // tonnes
  },
  environmentalImpact: {
    co2Sequestered: 12.6, // tonnes
    treesEquivalent: 201,
    carsOffRoad: 2.7, // equivalent cars taken off road for a year
    homePowered: 1.4, // homes powered for a year
    wasteReduced: 245, // kg
    waterSaved: 18500, // liters
    renewableEnergyGenerated: 45.2, // kWh
    biodiversityAreaProtected: 2.3 // hectares
  },
  creditEarnings: [
    {
      id: "EARN-001",
      activity: "Community Reforestation Project",
      date: "2024-12-15T10:30:00Z",
      creditsEarned: 12.5,
      ratePerCredit: 23.50,
      totalEarning: 293.75,
      status: "paid",
      paymentDate: "2024-12-18T14:20:00Z",
      project: "Urban Forest Initiative",
      verifiedBy: "Forest Carbon Standards",
      impact: {
        co2Saved: 0.625, // tonnes
        treesPlanted: 25
      }
    },
    {
      id: "EARN-002",
      activity: "Solar Panel Data Collection",
      date: "2024-12-12T08:15:00Z",
      creditsEarned: 8.0,
      ratePerCredit: 26.00,
      totalEarning: 208.00,
      status: "paid",
      paymentDate: "2024-12-15T11:30:00Z",
      project: "Distributed Solar Monitoring",
      verifiedBy: "Renewable Energy Council",
      impact: {
        co2Avoided: 0.4, // tonnes
        energyGenerated: 8.5 // kWh
      }
    },
    {
      id: "EARN-003",
      activity: "Waste Management Survey",
      date: "2024-12-10T16:45:00Z",
      creditsEarned: 6.2,
      ratePerCredit: 21.80,
      totalEarning: 135.16,
      status: "processing",
      paymentDate: null,
      project: "Circular Economy Initiative",
      verifiedBy: "Waste Management Authority",
      impact: {
        wasteReduced: 31, // kg
        recyclingImproved: 15 // percentage
      }
    },
    {
      id: "EARN-004",
      activity: "Mangrove Conservation Monitoring",
      date: "2024-12-08T06:30:00Z",
      creditsEarned: 15.3,
      ratePerCredit: 28.50,
      totalEarning: 436.05,
      status: "pending",
      paymentDate: null,
      project: "Coastal Ecosystem Protection",
      verifiedBy: "Marine Conservation Society",
      impact: {
        co2Sequestered: 0.765, // tonnes
        coastlineProtected: 0.5 // km
      }
    },
    {
      id: "EARN-005",
      activity: "Biodiversity Census Participation",
      date: "2024-12-05T05:00:00Z",
      creditsEarned: 4.8,
      ratePerCredit: 19.75,
      totalEarning: 94.80,
      status: "paid",
      paymentDate: "2024-12-08T13:15:00Z",
      project: "Wildlife Conservation Program",
      verifiedBy: "Biodiversity Institute",
      impact: {
        speciesDocumented: 18,
        habitatMapped: 1.2 // hectares
      }
    }
  ],
  monthlyEarnings: [
    { month: "Jul", credits: 8.2, earnings: 189.45, impact: 0.41 },
    { month: "Aug", credits: 12.6, earnings: 315.80, impact: 0.63 },
    { month: "Sep", credits: 18.4, earnings: 456.20, impact: 0.92 },
    { month: "Oct", credits: 15.8, earnings: 398.50, impact: 0.79 },
    { month: "Nov", credits: 22.3, earnings: 567.85, impact: 1.12 },
    { month: "Dec", credits: 19.7, earnings: 502.15, impact: 0.99 }
  ],
  impactBreakdown: [
    { category: "Carbon Sequestration", value: 8.2, percentage: 65.1, color: "#10b981", unit: "tonnes CO₂" },
    { category: "Renewable Energy", value: 2.1, percentage: 16.7, color: "#f59e0b", unit: "tonnes CO₂" },
    { category: "Waste Reduction", value: 1.4, percentage: 11.1, color: "#3b82f6", unit: "tonnes CO₂" },
    { category: "Water Conservation", value: 0.6, percentage: 4.8, color: "#06b6d4", unit: "tonnes CO₂" },
    { category: "Biodiversity Protection", value: 0.3, percentage: 2.4, color: "#8b5cf6", unit: "tonnes CO₂" }
  ],
  paymentHistory: [
    { date: "2024-12-18", amount: 293.75, method: "Bank Transfer", status: "completed", credits: 12.5 },
    { date: "2024-12-15", amount: 208.00, method: "Digital Wallet", status: "completed", credits: 8.0 },
    { date: "2024-12-08", amount: 94.80, method: "Bank Transfer", status: "completed", credits: 4.8 },
    { date: "2024-11-28", amount: 456.20, method: "Digital Wallet", status: "completed", credits: 18.4 },
    { date: "2024-11-15", amount: 315.80, method: "Bank Transfer", status: "completed", credits: 12.6 }
  ],
  comparisons: {
    globalAverage: {
      monthlyCredits: 8.5,
      monthlyEarnings: 205.30,
      annualImpact: 4.2
    },
    topPerformers: {
      monthlyCredits: 35.2,
      monthlyEarnings: 890.50,
      annualImpact: 18.4
    }
  },
  milestones: [
    { name: "First Credit", achieved: true, date: "2024-07-15", reward: 50 },
    { name: "100 Credits", achieved: true, date: "2024-11-22", reward: 200 },
    { name: "1000 USD Earned", achieved: true, date: "2024-10-08", reward: 100 },
    { name: "10 Tonnes CO₂", achieved: true, date: "2024-12-01", reward: 250 },
    { name: "Climate Champion", achieved: false, date: null, reward: 500 }
  ]
};

export default function ImpactsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("6months");
  const [impactData] = useState(mockImpactData);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "local") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 0) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(decimals)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-600";
      case "processing": return "bg-yellow-600";
      case "pending": return "bg-blue-600";
      case "failed": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Environmental Impact & Earnings</h1>
            <p className="text-gray-400 mt-1">Track your environmental contributions and carbon credit earnings</p>
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
            <Button variant="outline" className="border-gray-700">
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
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(impactData.overview.totalEarnings)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+{impactData.overview.earningsGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Carbon Credits Earned</p>
                  <p className="text-2xl font-bold text-white">{impactData.overview.totalCreditsEarned}</p>
                  <div className="flex items-center mt-1">
                    <Leaf className="w-4 h-4 text-emerald-400 mr-1" />
                    <span className="text-sm text-emerald-400">Avg ${impactData.overview.creditValue}/credit</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">CO₂ Impact</p>
                  <p className="text-2xl font-bold text-white">{impactData.overview.carbonFootprintReduced}t</p>
                  <div className="flex items-center mt-1">
                    <Globe className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-sm text-blue-400">Carbon reduced</span>
                  </div>
                </div>
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Payments</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(impactData.overview.pendingPayments)}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-400">In processing</span>
                  </div>
                </div>
                <Wallet className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Score */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Environmental Impact Score</h3>
                <p className="text-gray-400">Your contribution to climate action</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-400">{impactData.overview.impactScore}/100</div>
                <Badge className="bg-emerald-600 mt-1">Excellent Impact</Badge>
              </div>
            </div>
            <Progress value={impactData.overview.impactScore} className="h-3 bg-gray-800" />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Climate Contributor</span>
              <span>Climate Champion</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-gray-800">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-gray-800">
              <Globe className="w-4 h-4 mr-2" />
              Impact
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gray-800">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-gray-800">
              <Trophy className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Earnings Chart */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {impactData.monthlyEarnings.map((month, index) => {
                      const maxEarnings = Math.max(...impactData.monthlyEarnings.map(m => m.earnings));
                      const height = (month.earnings / maxEarnings) * 200;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="text-xs text-gray-400 mb-2">${formatNumber(month.earnings)}</div>
                          <div 
                            className="bg-gradient-to-t from-green-600 to-emerald-400 rounded-t w-full transition-all hover:opacity-80"
                            style={{ height: `${height}px` }}
                          />
                          <div className="text-xs text-gray-400 mt-2">{month.month}</div>
                          <div className="text-xs text-gray-500">{month.credits} credits</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Breakdown */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Impact Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {impactData.impactBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-white font-medium">{category.category}</span>
                          </div>
                          <span className="text-gray-400">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${category.percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{category.value} {category.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison with Others */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-blue-400 mb-2">You</h4>
                    <div className="space-y-2">
                      <div className="bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">{formatNumber(impactData.monthlyEarnings[impactData.monthlyEarnings.length - 1].credits, 1)}</p>
                        <p className="text-sm text-gray-400">Monthly Credits</p>
                      </div>
                      <div className="bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">${formatNumber(impactData.monthlyEarnings[impactData.monthlyEarnings.length - 1].earnings)}</p>
                        <p className="text-sm text-gray-400">Monthly Earnings</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">Global Average</h4>
                    <div className="space-y-2">
                      <div className="bg-yellow-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">{impactData.comparisons.globalAverage.monthlyCredits}</p>
                        <p className="text-sm text-gray-400">Monthly Credits</p>
                      </div>
                      <div className="bg-yellow-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">${formatNumber(impactData.comparisons.globalAverage.monthlyEarnings)}</p>
                        <p className="text-sm text-gray-400">Monthly Earnings</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-bold text-green-400 mb-2">Top Performers</h4>
                    <div className="space-y-2">
                      <div className="bg-green-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">{impactData.comparisons.topPerformers.monthlyCredits}</p>
                        <p className="text-sm text-gray-400">Monthly Credits</p>
                      </div>
                      <div className="bg-green-900/30 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-white">${formatNumber(impactData.comparisons.topPerformers.monthlyEarnings)}</p>
                        <p className="text-sm text-gray-400">Monthly Earnings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="space-y-4">
              {impactData.creditEarnings.map((earning) => (
                <Card key={earning.id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{earning.activity}</h3>
                          <Badge className={getStatusColor(earning.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(earning.status)}
                              {earning.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(earning.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {earning.project}
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {earning.verifiedBy}
                          </div>
                        </div>
                        
                        {/* Impact Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Credits Earned</p>
                            <p className="text-lg font-bold text-emerald-400">{earning.creditsEarned}</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Rate/Credit</p>
                            <p className="text-lg font-bold text-green-400">${earning.ratePerCredit}</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Total Earning</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(earning.totalEarning)}</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-lg font-bold text-yellow-400">
                              {earning.status === 'paid' ? 'Completed' : 'Processing'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Info */}
                    <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">
                          Earning ID: <span className="text-white">{earning.id}</span>
                        </span>
                        {earning.paymentDate && (
                          <span className="text-gray-400">
                            Paid on: <span className="text-green-400">{new Date(earning.paymentDate).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-gray-700">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Your Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-green-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{impactData.environmentalImpact.co2Sequestered}</p>
                    <p className="text-gray-400">Tonnes CO₂ Sequestered</p>
                    <p className="text-sm text-green-400 mt-1">
                      = {impactData.environmentalImpact.treesEquivalent} trees planted
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Wind className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{impactData.environmentalImpact.carsOffRoad}</p>
                    <p className="text-gray-400">Cars Off Road (1 year)</p>
                    <p className="text-sm text-blue-400 mt-1">
                      Equivalent impact
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-cyan-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Droplets className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{formatNumber(impactData.environmentalImpact.waterSaved)}</p>
                    <p className="text-gray-400">Liters Water Saved</p>
                    <p className="text-sm text-cyan-400 mt-1">
                      Conservation efforts
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{impactData.environmentalImpact.renewableEnergyGenerated}</p>
                    <p className="text-gray-400">kWh Clean Energy</p>
                    <p className="text-sm text-yellow-400 mt-1">
                      = {impactData.environmentalImpact.homePowered} homes/year
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-purple-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <RefreshCw className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{impactData.environmentalImpact.wasteReduced}</p>
                    <p className="text-gray-400">Kg Waste Reduced</p>
                    <p className="text-sm text-purple-400 mt-1">Recycling & cleanup efforts</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-emerald-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <TreePine className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{impactData.environmentalImpact.biodiversityAreaProtected}</p>
                    <p className="text-gray-400">Hectares Protected</p>
                    <p className="text-sm text-emerald-400 mt-1">Biodiversity conservation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactData.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-400">{payment.method} • {payment.credits} credits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-gray-400 mt-1">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactData.milestones.map((milestone, index) => (
                <Card key={index} className={`border-gray-800 ${
                  milestone.achieved ? 'bg-green-900/20 border-green-600/50' : 'bg-gray-900/50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        milestone.achieved ? 'bg-green-600' : 'bg-gray-700'
                      }`}>
                        {milestone.achieved ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Target className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${
                          milestone.achieved ? 'text-green-300' : 'text-white'
                        }`}>
                          {milestone.name}
                        </h3>
                        <p className="text-gray-400">
                          Reward: {formatCurrency(milestone.reward)}
                        </p>
                        {milestone.achieved ? (
                          <p className="text-sm text-green-400">
                            Achieved on {new Date(milestone.date!).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Not achieved yet</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
