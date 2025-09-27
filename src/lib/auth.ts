import { currentUser } from "@clerk/nextjs/server";

export interface UserRole {
  role: "admin" | "verifier" | "organization" | "local";
  organization: string;
  permissions: string[];
  onboardingComplete: boolean;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  const unsafeMetadata = user.unsafeMetadata as any;
  
  return {
    role: unsafeMetadata.role || "organization",
    organization: unsafeMetadata.organization || "",
    permissions: unsafeMetadata.permissions || [],
    onboardingComplete: unsafeMetadata.onboardingComplete || false
  };
}

export function checkPermission(userRole: UserRole, permission: string): boolean {
  return userRole.permissions.includes(permission);
}

export function canAccessAdminFeatures(userRole: UserRole): boolean {
  return userRole.role === "admin";
}

export function canAccessVerifierFeatures(userRole: UserRole): boolean {
  return userRole.role === "verifier" || userRole.role === "admin";
}

export function canAccessOrganizationFeatures(userRole: UserRole): boolean {
  return userRole.role === "organization" || userRole.role === "admin";
}
