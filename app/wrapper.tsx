"use client";
import useAuthContext from "@/hooks/custom/useAuthContext";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { GetUser } from "@/lib/apis/auth/GetUser";
import React, { useEffect } from "react";

interface wrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<wrapperProps> = ({ children }) => {
  const axios = useAxiosContext();
  const auth = useAuthContext();

  useEffect(() => {
    // Only try to get user data if we're not already logged in
    if (!auth.config.loggedIn) {
      console.log('Wrapper useEffect: Attempting to get user data...');
      GetUser({
        axios,
        onSuccess: (data) => {
          console.log('GetUser success:', data);
          auth.setConfig({
            loggedIn: true,
            id: data.data.user._id,
            email: data.data.user.email,
            voice: data.data.user.voice,
          });
          console.log('Auth config updated:', {
            loggedIn: true,
            id: data.data.user._id,
            email: data.data.user.email,
            voice: data.data.user.voice,
          });
        },

        onError: (error) => {
          console.error('GetUser error:', error);
          console.log('User not authenticated or error occurred');
          // Don't set loggedIn to false here, as it might already be false
          // and we don't want to override a successful login from elsewhere
        },
      });
    } else {
      console.log('User already logged in, skipping GetUser call');
    }
  }, [axios, auth.config.loggedIn, auth]); // Added auth dependency

  return <>{children}</>;
};

export default Wrapper;
