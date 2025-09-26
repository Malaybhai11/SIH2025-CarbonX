"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleBasedComponent({ children, allowedRoles }: RoleBasedComponentProps) {
  const { user } = useUser();
  
  if (!user) {
    return null;
  }
  
  const userRole = (user?.unsafeMetadata as any)?.role || "organization";
  
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return null;
}
