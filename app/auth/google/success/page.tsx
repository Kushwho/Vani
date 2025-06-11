"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAuthContext from "@/hooks/custom/useAuthContext";
import { GetUser } from "@/lib/apis/auth/GetUser";
import useAxiosContext from "@/hooks/custom/useAxiosContext";

const GoogleAuthSuccess = () => {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuthContext();
  const axios = useAxiosContext();

  useEffect(() => {
    GetUser({
      axios,
      onSuccess: (response) => {
        const userData = response.data.user;
        
        // Set auth state with user data
        auth?.setConfig({
          loggedIn: true,
          id: userData._id,
          email: userData.email,
          voice: userData.voice || ""
        });

        toast({
          title: "Success!",
          description: "Google authentication successful. Welcome to Vanii!",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      },
      onError: (error) => {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
        router.push("/login");
      }
    });
  }, [router, toast, auth, axios]);

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
