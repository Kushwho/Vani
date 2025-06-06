"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAuthContext from "@/hooks/custom/useAuthContext";

const GoogleAuthSuccess = () => {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuthContext();

  useEffect(() => {
    // Show success message
    toast({
      title: "Success!",
      description: "Google authentication successful. Welcome to Vanii!",
    });

    // Set user as logged in (the backend should have set the cookie)
    // You might want to fetch user data from a protected endpoint here
    auth?.setConfig({
      loggedIn: true,
      id: "", // Will be populated from backend
      email: "", // Will be populated from backend
      voice: "" // Will be populated from backend
    });

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }, [router, toast, auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Successful!
        </h1>
        <p className="text-gray-600">
          Redirecting you to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
