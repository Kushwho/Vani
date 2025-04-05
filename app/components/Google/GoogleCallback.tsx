import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Define a proper interface for user data
interface UserData {
  _id: string;
  email: string;
  voice?: string;
  [key: string]: unknown; // For any additional properties
}

const GoogleCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");
        
        if (!code) {
          setError("No authorization code found");
          setLoading(false);
          return;
        }

        // Call the backend callback endpoint with the code
        const response = await fetch("/api/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include", // Important for cookies
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        
        // Store the token or user data as needed
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user as UserData));
        }
        
        // Redirect to the dashboard or home page
        navigate("/dashboard");
      } catch (err) {
        console.error("Callback error:", err);
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return null;
};

export default GoogleCallback; 