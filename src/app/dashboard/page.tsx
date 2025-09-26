// pages/index.js
"use client";
import SpaceBackground from '../../components/SpaceBackground';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait until Clerk has loaded the user state
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const onboardingComplete = (user?.unsafeMetadata as any)?.onboardingComplete;
      if (!onboardingComplete) {
        router.push("/onboarding");
        return;
      }

      const role = (user?.unsafeMetadata as any)?.role;
      if (role) {
        if (role === "local") {
          router.push(`/dashboard/local`);
        } else {
          router.push(`/dashboard/${role}`);
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <SpaceBackground>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '4rem' }}>
          Redirecting...
        </h1>
      </div>
    </SpaceBackground>
  );
}
