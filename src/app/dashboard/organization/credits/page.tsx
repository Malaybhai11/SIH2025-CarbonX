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
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Gift,
  History,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Plus,
  Minus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  Leaf,
  Award,
  TrendingUpIcon
} from "lucide-react";

// Mock credits data
const mockCreditsData = {
  portfolio: {
    totalCredits: 12450,
    availableCredits: 8200,
    lockedCredits: 3100,
    retiredCredits: 1150,
    totalValue: 248900, // USD
    avgCreditPrice: 20.0,
    monthlyGrowth: 15.2,
    portfolioGrowth: 8.7
  },
  breakdown: [
    { type: "Reforestation", credits: 4500, value: 90000, percentage: 36.1, color: "#10b981" },
    { type: "Renewable Energy", credits: 3200, value: 64000, percentage: 25.7, color: "#f59e0b" },
    { type: "Ocean Protection", credits: 2100, value: 42000, percentage: 16.9, color: "#3b82f6" },
    { type: "Soil Conservation", credits: 1650, value: 33000, percentage: 13.3, color: "#8b5cf6" },
    { type: "Wildlife Protection", credits: 1000, value: 20000, percentage: 8.0, color: "#ef4444" }
  ],
  transactions: [
    {
      id: "TXN-001",
      type: "buy",
      credits: 500,
      pricePerCredit: 22.50,
      totalAmount: 11250,
      projectType: "Reforestation",
      projectName: "Amazon Conservation Project",
      counterparty: "Green Solutions Ltd",
      date: "2024-12-15T10:30:00Z",
      status: "completed",
      transactionFee: 112.50
    },
    {
      id: "TXN-002",
      type: "sell",
      credits: 300,
      pricePerCredit: 24.00,
      totalAmount: 7200,
      projectType: "Renewable Energy",
      projectName: "Solar Farm Maharashtra",
      counterparty: "EcoTech Industries",
      date: "2024-12-12T14:15:00Z",
      status: "completed",
      transactionFee: 72.00
    },
    {
      id: "TXN-003",
      type: "donate",
      credits: 150,
      pricePerCredit: 20.00,
      totalAmount: 3000,
      projectType: "Ocean Protection",
      projectName: "Mangrove Restoration",
      counterparty: "Ocean Conservation NGO",
      date: "2024-12-10T09:45:00Z",
      status: "completed",
      transactionFee: 0
    },
    {
      id: "TXN-004",
      type: "retire",
      credits: 200,
      pricePerCredit: 21.00,
      totalAmount: 4200,
      projectType: "Soil Conservation",
      projectName: "Sustainable Agriculture Initiative",
      counterparty: "Carbon Offset Retirement",
      date: "2024-12-08T16:20:00Z",
      status: "completed",
      transactionFee: 0
    },
    {
      id: "TXN-005",
      type: "buy",
      credits: 750,
      pricePerCredit: 19.50,
      totalAmount: 14625,
      projectType: "Wildlife Protection",
      projectName: "Elephant Corridor Protection",
      counterparty: "Wildlife Trust Foundation",
      date: "2024-12-05T11:10:00Z",
      status: "pending",
      transactionFee: 146.25
    }
  ],
  marketData: {
    currentPrices: [
      { type: "Reforestation", price: 22.5, change: 2.3, volume: 15600 },
      { type: "Renewable Energy", price: 24.0, change: -1.2, volume: 12400 },
      { type: "Ocean Protection", price: 21.8, change: 4.1, volume: 8900 },
      { type: "Soil Conservation", price: 20.5, change: 0.8, volume: 6700 },
      { type: "Wildlife Protection", price: 26.2, change: 3.7, volume: 4200 }
    ],
    tradingPairs: [
      { from: "Green Solutions Ltd", credits: 2500, rate: 22.0 },
      { from: "EcoTech Industries", credits: 1800, rate: 24.5 },
      { from: "Carbon Trust Foundation", credits: 3200, rate: 21.8 },
      { from: "Renewable Energy Corp", credits: 1500, rate: 23.9 }
    ]
  }
};

export default function CreditsManagement() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [creditsData] = useState(mockCreditsData);

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "organization") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "buy": return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case "sell": return <ArrowUpRight className="w-4 h-4 text-blue-400" />;
      case "donate": return <Gift className="w-4 h-4 text-purple-400" />;
      case "retire": return <Target className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "buy": return "text-green-400";
      case "sell": return "text-blue-400";
      case "donate": return "text-purple-400";
      case "retire": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "pending": return "bg-yellow-600";
      case "failed": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredTransactions = creditsData.transactions.filter(transaction => {
    const matchesSearch = transaction.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = transactionFilter === "all" || transaction.type === transactionFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Credits Management</h1>
            <p className="text-gray-400 mt-1">Trade, manage, and track your carbon credit portfolio</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/dashboard/organization/credits/trade')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Trade
            </Button>
            <Button variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Credits</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(creditsData.portfolio.totalCredits)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+{creditsData.portfolio.monthlyGrowth}%</span>
                  </div>
                </div>
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(creditsData.portfolio.totalValue)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+{creditsData.portfolio.portfolioGrowth}%</span>
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
                  <p className="text-sm text-gray-400">Available Credits</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(creditsData.portfolio.availableCredits)}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-sm text-blue-400">Ready to trade</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Credit Price</p>
                  <p className="text-2xl font-bold text-white">${creditsData.portfolio.avgCreditPrice}</p>
                  <div className="flex items-center mt-1">
                    <BarChart3 className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-sm text-purple-400">Per credit</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-gray-800">
              <PieChart className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-800">
              <History className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-gray-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Market
            </TabsTrigger>
            <TabsTrigger value="trade" className="data-[state=active]:bg-gray-800">
              <Activity className="w-4 h-4 mr-2" />
              Quick Trade
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Type Distribution */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Credits by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditsData.breakdown.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: type.color }}
                            />
                            <span className="text-white font-medium">{type.type}</span>
                          </div>
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
                          <span>{formatNumber(type.credits)} credits</span>
                          <span>{formatCurrency(type.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Credit Status */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Credit Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-900/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Available Credits</p>
                          <p className="text-sm text-gray-400">Ready for trading</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{formatNumber(creditsData.portfolio.availableCredits)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-900/20">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Locked Credits</p>
                          <p className="text-sm text-gray-400">In pending transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-400">{formatNumber(creditsData.portfolio.lockedCredits)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">Retired Credits</p>
                          <p className="text-sm text-gray-400">Permanently offset</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-400">{formatNumber(creditsData.portfolio.retiredCredits)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="buy">Buy Orders</SelectItem>
                      <SelectItem value="sell">Sell Orders</SelectItem>
                      <SelectItem value="donate">Donations</SelectItem>
                      <SelectItem value="retire">Retirements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className={`font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                              {transaction.type}
                            </p>
                            <p className="text-sm text-gray-400">{transaction.id}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.projectName}</p>
                          <p className="text-sm text-gray-400">{transaction.counterparty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white font-medium">{formatNumber(transaction.credits)} credits</p>
                          <p className="text-sm text-gray-400">${transaction.pricePerCredit}/credit</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{formatCurrency(transaction.totalAmount)}</p>
                          <p className="text-sm text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Market Prices */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUpIcon className="w-5 h-5 mr-2" />
                    Current Market Prices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditsData.marketData.currentPrices.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <div>
                          <p className="text-white font-medium">{item.type}</p>
                          <p className="text-sm text-gray-400">{formatNumber(item.volume)} volume</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${item.price}</p>
                          <div className="flex items-center">
                            {item.change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                            )}
                            <span className={`text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {item.change > 0 ? '+' : ''}{item.change}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Trading Pairs */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Trading Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditsData.marketData.tradingPairs.map((pair, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <div>
                          <p className="text-white font-medium">{pair.from}</p>
                          <p className="text-sm text-gray-400">{formatNumber(pair.credits)} credits available</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${pair.rate}</p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 mt-1">
                            Trade
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quick Trade Tab */}
          <TabsContent value="trade" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buy Credits */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowDownRight className="w-5 h-5 mr-2 text-green-400" />
                    Buy Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Credit Type</label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select credit type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="reforestation">Reforestation ($22.50)</SelectItem>
                        <SelectItem value="renewable">Renewable Energy ($24.00)</SelectItem>
                        <SelectItem value="ocean">Ocean Protection ($21.80)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <Input placeholder="Enter number of credits" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Price per Credit</label>
                    <Input placeholder="Enter max price" className="bg-gray-800 border-gray-700" />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Place Buy Order
                  </Button>
                </CardContent>
              </Card>

              {/* Sell Credits */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowUpRight className="w-5 h-5 mr-2 text-blue-400" />
                    Sell Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Credits</label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select from your credits" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="reforestation">Reforestation (4,500 available)</SelectItem>
                        <SelectItem value="renewable">Renewable Energy (3,200 available)</SelectItem>
                        <SelectItem value="ocean">Ocean Protection (2,100 available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Sell</label>
                    <Input placeholder="Enter number of credits" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Price per Credit</label>
                    <Input placeholder="Enter min price" className="bg-gray-800 border-gray-700" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Place Sell Order
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-purple-400" />
                    Donate Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Donate credits to environmental NGOs and get tax benefits while supporting conservation efforts.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Gift className="w-4 h-4 mr-2" />
                    Start Donation
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-400" />
                    Retire Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Permanently retire credits to offset your organization's carbon footprint and demonstrate environmental responsibility.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Target className="w-4 h-4 mr-2" />
                    Retire Credits
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
