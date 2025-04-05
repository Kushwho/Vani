import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Make a GET request to the backend API
      const response = await fetch("https://backend.vanii.ai/auth/api/v1/user/google", {
        method: "GET",
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      // Handle the response as needed
      const data = await response.json();
      console.log("Google auth response:", data);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Google authentication successful",
      });
      
      // You can handle the response data here
      // For example, redirect to a specific page or update UI
      
    } catch (error) {
      console.error("Google auth error:", error);
      toast({
        title: "Error",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
      </Button>
    </div>
  );
};

export default GoogleLogin;