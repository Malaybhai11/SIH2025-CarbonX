// pages/index.js
"use client";

import SpaceBackground from '../../components/SpaceBackground';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApiClient } from "@/lib/api-client";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUserAndRedirect() {
      // Wait until Clerk has loaded the user state
      if (!isLoaded) return;

      if (!isSignedIn || !user) {
        router.push('/sign-in');
        return;
      }

      try {
        // Try to fetch user from Supabase first
        const response = await apiClient.getUsers();
        const supabaseUser = response.users?.[0];

        if (supabaseUser && supabaseUser.metadata?.onboardingComplete) {
          // User exists in Supabase and has completed onboarding
          const role = supabaseUser.role;
          if (role === "local") {
            router.push(`/dashboard/local`);
          } else {
            router.push(`/dashboard/${role}`);
          }
          return;
        }

        // Fallback to Clerk metadata for backward compatibility
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
      } catch (err) {
        console.error('Error fetching user data:', err);
        // If API fails, fall back to Clerk metadata
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
      } finally {
        setLoading(false);
      }
    }

    checkUserAndRedirect();
  }, [isLoaded, isSignedIn, user, router]);

  if (loading) {
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
          <div>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              Loading...
            </h1>
            <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>
              Setting up your dashboard
            </div>
          </div>
        </div>
      </SpaceBackground>
    );
  }

  if (error) {
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
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff6b6b' }}>
              Error
            </h1>
            <div style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '2rem' }}>
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#00D4AA',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </SpaceBackground>
    );
  }

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
