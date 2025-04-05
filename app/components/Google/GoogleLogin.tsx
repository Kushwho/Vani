import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAuthContext from "@/hooks/custom/useAuthContext";

interface GoogleLoginProps {
  onSuccess?: (userData: any) => void;
}

const GoogleLogin = ({ onSuccess }: GoogleLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuthContext();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Make API call to backend instead of direct redirection
        const result = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.access_token }),
          credentials: "include", // Important for cookies
        });

        if (!result.ok) {
          throw new Error("Authentication failed");
        }

        const data = await result.json();
        
        // Store user data if needed
        if (data.user) {
        //   localStorage.setItem("user", JSON.stringify(data.user));
          
          // Update auth context if available
          if (auth) {
            auth.setConfig({
              loggedIn: true,
              id: data.user._id,
              email: data.user.email,
              voice: data.user.voice
            });
          }
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(data.user);
          }
          
          // Show success toast
          toast({
            title: "Success",
            description: "Google login successful",
          });
          
          // Redirect to dashboard or home page
          router.push("/");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Authentication failed. Please try again.");
        toast({
          title: "Error",
          description: "Google login failed. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.error("Login Failed");
      setError("Google login failed. Please try again.");
      toast({
        title: "Error",
        description: "Google login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full"
        onClick={() => login()}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
      </Button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default GoogleLogin;