"use client";

import { SignUp } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
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
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
