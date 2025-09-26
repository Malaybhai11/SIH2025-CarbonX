"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  
  const [role, setRole] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [loading, setLoading] = useState(false);

  const getPermissionsForRole = (selectedRole: string) => {
    switch (selectedRole) {
      case "admin":
        return ["verify_data", "upload_records", "view_reports", "manage_users", "create_projects"];
      case "organization":
        return ["upload_records", "view_reports", "create_projects"];
      case "local":
        return ["upload_records"];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    // Only require organization type for non-admin roles
    const finalOrganizationType = role === "admin" ? "Government Authority" : organizationType;
    if (role !== "admin" && !organizationType) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Assign permissions based on role
      const assignedPermissions = getPermissionsForRole(role);

      // Update user metadata with onboarding info
      await user?.update({
        unsafeMetadata: {
          role,
          organization: finalOrganizationType,
          permissions: assignedPermissions,
          onboardingComplete: true
        }
      });

      // Redirect based on role
      switch (role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "verifier":
          router.push("/dashboard/verifier");
          break;
        case "local":
          router.push("/dashboard/local");
          break;
        default:
          router.push("/dashboard/organization");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
    <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
      <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
      <p className="text-sm text-gray-400 mb-6">Tell us more about you</p>

      {/* Role Selector */}
      <label className="block mb-2 text-sm font-medium">Role *</label>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {[
          { value: "admin", label: "NCCR Admin", description: "Government authority / verifier" },
          { value: "organization", label: "NGO / Organization", description: "Project submitter" },
          { value: "local", label: "Local / Individual", description: "Data contributor" }
        ].map((roleOption) => (
          <button
            key={roleOption.value}
            onClick={() => setRole(roleOption.value)}
            className={`p-4 rounded-lg border transition text-left ${
              role === roleOption.value
                ? "border-pink-500 bg-pink-500/20 text-pink-300"
                : "border-gray-600 hover:border-pink-500 hover:bg-pink-500/20"
            }`}
          >
            <div className="font-medium">{roleOption.label}</div>
            <div className="text-sm opacity-75">{roleOption.description}</div>
          </button>
        ))}
      </div>

      {/* Organization Type - Only show for non-admin roles */}
      {role !== "admin" && (
        <>
          <label className="block mb-2 text-sm font-medium">Organization Type *</label>
          <input
            type="text"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
            placeholder="Enter your organization type"
            className="w-full mb-6 px-4 py-3 rounded-lg bg-white/5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
          />
        </>
      )}

      {/* Button */}
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Complete Onboarding"}
      </button>
    </div>
  </div>
);
}
