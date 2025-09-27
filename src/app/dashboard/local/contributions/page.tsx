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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  Camera,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Users,
  Star,
  Gift,
  Trophy,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  Globe,
  TreePine,
  Droplets,
  Wind,
  Zap,
  Heart,
  Share2,
  Camera as CameraIcon,
  Upload,
  RefreshCw,
  AlertCircle
} from "lucide-react";

// Mock contributions data for local user
const mockContributionsData = {
  summary: {
    totalContributions: 156,
    totalPoints: 12450,
    currentLevel: "Eco Champion",
    nextLevel: "Planet Guardian",
    pointsToNextLevel: 2550,
    totalImpact: 8.7, // tonnes CO2
    contributionStreak: 23, // days
    rank: 15, // out of all users
    badgesEarned: 12
  },
  contributions: [
    {
      id: "CONT-001",
      type: "tree_planting",
      title: "Community Tree Planting Drive",
      description: "Planted 15 saplings in the local park as part of the weekend environmental drive.",
      location: "Central Park, Delhi",
      coordinates: "28.6139, 77.2090",
      date: "2024-12-14T09:30:00Z",
      status: "verified",
      points: 150,
      impact: {
        co2Saved: 0.75, // tonnes
        treesPlanted: 15,
        areaRestored: 0.5 // hectares
      },
      photos: [
        { url: "/images/tree-planting-1.jpg", caption: "Planting saplings" },
        { url: "/images/tree-planting-2.jpg", caption: "Group photo" }
      ],
      verifiedBy: "Local Forest Department",
      project: "Urban Reforestation Initiative"
    },
    {
      id: "CONT-002",
      type: "waste_collection",
      title: "Beach Cleanup Campaign",
      description: "Collected 25kg of plastic waste from the beach during the monthly cleanup event.",
      location: "Marina Beach, Chennai",
      coordinates: "13.0475, 80.2824",
      date: "2024-12-10T06:00:00Z",
      status: "verified",
      points: 125,
      impact: {
        wasteCollected: 25, // kg
        beachAreaCleaned: 1.2 // km
      },
      photos: [
        { url: "/images/beach-cleanup-1.jpg", caption: "Waste collection" },
        { url: "/images/beach-cleanup-2.jpg", caption: "Clean beach result" }
      ],
      verifiedBy: "Ocean Conservation NGO",
      project: "Coastal Protection Project"
    },
    {
      id: "CONT-003",
      type: "energy_saving",
      title: "Solar Panel Installation Report",
      description: "Documented successful installation of 5kW solar panels in residential area.",
      location: "Sector 15, Gurgaon",
      coordinates: "28.4595, 77.0266",
      date: "2024-12-08T14:15:00Z",
      status: "pending",
      points: 200,
      impact: {
        energyGenerated: 5, // kW
        co2Avoided: 2.1 // tonnes annually
      },
      photos: [
        { url: "/images/solar-install-1.jpg", caption: "Panel installation" }
      ],
      verifiedBy: "Renewable Energy Commission",
      project: "Distributed Solar Program"
    },
    {
      id: "CONT-004",
      type: "water_conservation",
      title: "Rainwater Harvesting Setup",
      description: "Helped install rainwater harvesting system for community building.",
      location: "Koramangala, Bangalore",
      coordinates: "12.9352, 77.6245",
      date: "2024-12-05T10:45:00Z",
      status: "verified",
      points: 175,
      impact: {
        waterSaved: 2000, // liters annually
        householdsServed: 25
      },
      photos: [
        { url: "/images/water-harvest-1.jpg", caption: "System setup" },
        { url: "/images/water-harvest-2.jpg", caption: "Installation complete" }
      ],
      verifiedBy: "Water Management Authority",
      project: "Urban Water Conservation"
    },
    {
      id: "CONT-005",
      type: "biodiversity",
      title: "Wildlife Monitoring Survey",
      description: "Participated in monthly wildlife census and documented local bird species.",
      location: "Keoladeo National Park, Bharatpur",
      coordinates: "27.1594, 77.5169",
      date: "2024-12-01T05:30:00Z",
      status: "verified",
      points: 100,
      impact: {
        speciesDocumented: 23,
        areaMonitored: 5 // km²
      },
      photos: [
        { url: "/images/bird-survey-1.jpg", caption: "Bird documentation" },
        { url: "/images/bird-survey-2.jpg", caption: "Survey team" }
      ],
      verifiedBy: "Wildlife Conservation Society",
      project: "Biodiversity Monitoring Program"
    }
  ],
  achievements: [
    {
      id: "ACH-001",
      name: "Tree Planter",
      description: "Planted over 100 trees",
      icon: "🌳",
      level: "Gold",
      unlockedDate: "2024-11-15",
      progress: 156,
      target: 100
    },
    {
      id: "ACH-002",
      name: "Waste Warrior",
      description: "Collected over 500kg of waste",
      icon: "♻️",
      level: "Silver",
      unlockedDate: "2024-10-20",
      progress: 347,
      target: 500
    },
    {
      id: "ACH-003",
      name: "Energy Saver",
      description: "Contributed to 50kW renewable energy",
      icon: "⚡",
      level: "Bronze",
      unlockedDate: "2024-12-08",
      progress: 23,
      target: 50
    },
    {
      id: "ACH-004",
      name: "Water Guardian",
      description: "Helped save 10,000L of water",
      icon: "💧",
      level: "Gold",
      unlockedDate: "2024-09-12",
      progress: 12450,
      target: 10000
    }
  ],
  leaderboard: [
    { rank: 1, name: "Maya Patel", points: 18500, contributions: 234, streak: 45 },
    { rank: 2, name: "Arjun Kumar", points: 16200, contributions: 198, streak: 32 },
    { rank: 3, name: "Priya Singh", points: 15800, contributions: 189, streak: 28 },
    { rank: 15, name: "You", points: 12450, contributions: 156, streak: 23, isCurrentUser: true },
    { rank: 16, name: "Raj Sharma", points: 12100, contributions: 151, streak: 19 },
    { rank: 17, name: "Neha Gupta", points: 11900, contributions: 148, streak: 15 }
  ],
  monthlyStats: [
    { month: "Jul", contributions: 12, points: 1200, impact: 0.8 },
    { month: "Aug", contributions: 18, points: 1800, impact: 1.2 },
    { month: "Sep", contributions: 25, points: 2500, impact: 1.8 },
    { month: "Oct", contributions: 22, points: 2200, impact: 1.5 },
    { month: "Nov", contributions: 28, points: 2800, impact: 2.1 },
    { month: "Dec", contributions: 15, points: 1500, impact: 1.3 }
  ],
  impactSummary: {
    totalCO2Saved: 8.7,
    treesPlanted: 78,
    wasteCollected: 156, // kg
    waterSaved: 8500, // liters
    energyGenerated: 23, // kW
    areaRestored: 3.2 // hectares
  }
};

export default function ContributionsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contributionsData] = useState(mockContributionsData);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "local") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "tree_planting": return <TreePine className="w-5 h-5 text-green-400" />;
      case "waste_collection": return <RefreshCw className="w-5 h-5 text-blue-400" />;
      case "energy_saving": return <Zap className="w-5 h-5 text-yellow-400" />;
      case "water_conservation": return <Droplets className="w-5 h-5 text-cyan-400" />;
      case "biodiversity": return <Leaf className="w-5 h-5 text-emerald-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getContributionColor = (type: string) => {
    switch (type) {
      case "tree_planting": return "text-green-400";
      case "waste_collection": return "text-blue-400";
      case "energy_saving": return "text-yellow-400";
      case "water_conservation": return "text-cyan-400";
      case "biodiversity": return "text-emerald-400";
      default: return "text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-600";
      case "pending": return "bg-yellow-600";
      case "rejected": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredContributions = contributionsData.contributions.filter(contribution => {
    const matchesSearch = contribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || contribution.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const levelProgress = ((contributionsData.summary.totalPoints - (contributionsData.summary.totalPoints - contributionsData.summary.pointsToNextLevel)) / 15000) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">My Contributions</h1>
            <p className="text-gray-400 mt-1">Track your environmental impact and earn rewards</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/dashboard/local/contribute/new')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contribution
            </Button>
            <Button variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Contributions</p>
                  <p className="text-2xl font-bold text-white">{contributionsData.summary.totalContributions}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">{contributionsData.summary.contributionStreak} day streak</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(contributionsData.summary.totalPoints)}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-400">Rank #{contributionsData.summary.rank}</span>
                  </div>
                </div>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">CO₂ Impact</p>
                  <p className="text-2xl font-bold text-white">{contributionsData.summary.totalImpact}t</p>
                  <div className="flex items-center mt-1">
                    <Leaf className="w-4 h-4 text-emerald-400 mr-1" />
                    <span className="text-sm text-emerald-400">CO₂ saved</span>
                  </div>
                </div>
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Level</p>
                  <p className="text-2xl font-bold text-white">{contributionsData.summary.currentLevel}</p>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-sm text-purple-400">{contributionsData.summary.badgesEarned} badges</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Level Progress</h3>
                <p className="text-gray-400">
                  {contributionsData.summary.pointsToNextLevel} points to reach {contributionsData.summary.nextLevel}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-purple-600">{contributionsData.summary.currentLevel}</Badge>
                <span className="text-gray-400">→</span>
                <Badge variant="outline" className="border-purple-600">{contributionsData.summary.nextLevel}</Badge>
              </div>
            </div>
            <Progress value={levelProgress} className="h-3 bg-gray-800" />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{formatNumber(contributionsData.summary.totalPoints)} points</span>
              <span>{formatNumber(contributionsData.summary.totalPoints + contributionsData.summary.pointsToNextLevel)} points</span>
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
            <TabsTrigger value="contributions" className="data-[state=active]:bg-gray-800">
              <Activity className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-800">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gray-800">
              <Users className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-gray-800">
              <Globe className="w-4 h-4 mr-2" />
              Impact
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Activity Chart */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {contributionsData.monthlyStats.map((month, index) => {
                      const maxContributions = Math.max(...contributionsData.monthlyStats.map(m => m.contributions));
                      const height = (month.contributions / maxContributions) * 200;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="text-xs text-gray-400 mb-2">{month.contributions}</div>
                          <div 
                            className="bg-gradient-to-t from-green-600 to-emerald-400 rounded-t w-full transition-all hover:opacity-80"
                            style={{ height: `${height}px` }}
                          />
                          <div className="text-xs text-gray-400 mt-2">{month.month}</div>
                          <div className="text-xs text-gray-500">{formatNumber(month.points)} pts</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Types */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Contribution Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Tree Planting", count: 45, percentage: 28.8, color: "#10b981" },
                      { type: "Waste Collection", count: 38, percentage: 24.4, color: "#3b82f6" },
                      { type: "Energy Saving", count: 28, percentage: 17.9, color: "#f59e0b" },
                      { type: "Water Conservation", count: 25, percentage: 16.0, color: "#06b6d4" },
                      { type: "Biodiversity", count: 20, percentage: 12.8, color: "#10b981" }
                    ].map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{type.type}</span>
                          <span className="text-gray-400">{type.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${type.percentage}%`,
                              backgroundColor: type.color
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{type.count} activities</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="space-y-6">
            {/* Filters */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search contributions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="tree_planting">Tree Planting</SelectItem>
                      <SelectItem value="waste_collection">Waste Collection</SelectItem>
                      <SelectItem value="energy_saving">Energy Saving</SelectItem>
                      <SelectItem value="water_conservation">Water Conservation</SelectItem>
                      <SelectItem value="biodiversity">Biodiversity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contributions List */}
            <div className="space-y-4">
              {filteredContributions.map((contribution) => (
                <Card key={contribution.id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getContributionIcon(contribution.type)}
                          <h3 className="text-xl font-bold text-white">{contribution.title}</h3>
                          <Badge className={getStatusColor(contribution.status)}>
                            {contribution.status === "verified" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {contribution.status}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600">
                            +{contribution.points} points
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-3">{contribution.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {contribution.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(contribution.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Camera className="w-4 h-4" />
                            {contribution.photos.length} photos
                          </div>
                        </div>
                        
                        {/* Impact Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {contribution.impact.co2Saved && (
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <p className="text-sm text-gray-400">CO₂ Saved</p>
                              <p className="text-lg font-bold text-green-400">{contribution.impact.co2Saved}t</p>
                            </div>
                          )}
                          {contribution.impact.treesPlanted && (
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <p className="text-sm text-gray-400">Trees Planted</p>
                              <p className="text-lg font-bold text-emerald-400">{contribution.impact.treesPlanted}</p>
                            </div>
                          )}
                          {contribution.impact.wasteCollected && (
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <p className="text-sm text-gray-400">Waste Collected</p>
                              <p className="text-lg font-bold text-blue-400">{contribution.impact.wasteCollected}kg</p>
                            </div>
                          )}
                          {contribution.impact.waterSaved && (
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <p className="text-sm text-gray-400">Water Saved</p>
                              <p className="text-lg font-bold text-cyan-400">{formatNumber(contribution.impact.waterSaved)}L</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-gray-700">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-700">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    {/* Verification Info */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">Verified by: <span className="text-white">{contribution.verifiedBy}</span></span>
                        <span className="text-gray-400">Project: <span className="text-white">{contribution.project}</span></span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400">Contribution ID: </span>
                        <span className="text-gray-300">{contribution.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contributionsData.achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                          <Badge className={
                            achievement.level === 'Gold' ? 'bg-yellow-600' :
                            achievement.level === 'Silver' ? 'bg-gray-600' : 'bg-orange-600'
                          }>
                            {achievement.level}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{formatNumber(achievement.progress)} / {formatNumber(achievement.target)}</span>
                          </div>
                          <Progress 
                            value={Math.min((achievement.progress / achievement.target) * 100, 100)} 
                            className="h-2 bg-gray-800" 
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                          Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contributionsData.leaderboard.map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        user.isCurrentUser ? 'bg-blue-900/30 border border-blue-600/50' : 'bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank <= 3 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white' :
                          user.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {user.rank <= 3 ? (
                            user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                          ) : (
                            user.rank
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${user.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                            {user.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{user.contributions} contributions</span>
                            <span>{user.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${user.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                          {formatNumber(user.points)}
                        </p>
                        <p className="text-sm text-gray-400">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{contributionsData.impactSummary.totalCO2Saved}</p>
                    <p className="text-gray-400">Tonnes CO₂ Saved</p>
                    <p className="text-sm text-green-400 mt-1">Equivalent to planting {Math.round(contributionsData.impactSummary.totalCO2Saved * 16)} trees</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-emerald-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <TreePine className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{contributionsData.impactSummary.treesPlanted}</p>
                    <p className="text-gray-400">Trees Planted</p>
                    <p className="text-sm text-emerald-400 mt-1">Covering {contributionsData.impactSummary.areaRestored} hectares</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <RefreshCw className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{contributionsData.impactSummary.wasteCollected}</p>
                    <p className="text-gray-400">Kg Waste Collected</p>
                    <p className="text-sm text-blue-400 mt-1">Preventing ocean pollution</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-cyan-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Droplets className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{formatNumber(contributionsData.impactSummary.waterSaved)}</p>
                    <p className="text-gray-400">Liters Water Saved</p>
                    <p className="text-sm text-cyan-400 mt-1">Annual conservation impact</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-900/30 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">{contributionsData.impactSummary.energyGenerated}</p>
                    <p className="text-gray-400">kW Clean Energy</p>
                    <p className="text-sm text-yellow-400 mt-1">Renewable energy contributed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
