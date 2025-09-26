"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, CheckCircle, XCircle, Clock, Filter } from "lucide-react";

// Mock data - in real app this would come from API
const mockUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@greentech.com",
    organization: "GreenTech Inc",
    role: "pending",
    status: "pending_approval",
    appliedDate: "2024-01-15",
    permissions: ["verify_data", "upload_records"]
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@ecocorp.com",
    organization: "EcoCorp",
    role: "verifier",
    status: "active",
    appliedDate: "2024-01-10",
    permissions: ["verify_data", "manage_users"]
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@sustainable.org",
    organization: "Sustainable Solutions",
    role: "organization",
    status: "active",
    appliedDate: "2024-01-08",
    permissions: ["upload_records", "view_reports"]
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@carbonoffset.com",
    organization: "Carbon Offset Ltd",
    role: "pending",
    status: "pending_approval",
    appliedDate: "2024-01-20",
    permissions: ["upload_records", "create_projects"]
  }
];

export default function UserManagement() {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const role = (user?.unsafeMetadata as any)?.role;
    if (role && role !== "admin") {
      router.push(`/dashboard/${role}`);
    }
  }, [user, router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: "active" as const } : u
    ));
  };

  const handleRejectUser = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: "rejected" as const } : u
    ));
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "pending_approval":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-600">Admin</Badge>;
      case "verifier":
        return <Badge className="bg-blue-600">Verifier</Badge>;
      case "organization":
        return <Badge className="bg-green-600">Organization</Badge>;
      case "pending":
        return <Badge className="bg-gray-600">Pending</Badge>;
      default:
        return <Badge className="bg-gray-600">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Users className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users by name, email, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-gray-400 mb-1">{user.email}</p>
                    <p className="text-gray-400 mb-2">{user.organization}</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {user.status === "pending_approval" && (
                      <>
                        <Button
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectUser(user.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {user.status === "active" && (
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="verifier">Verifier</SelectItem>
                          <SelectItem value="organization">Organization</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
