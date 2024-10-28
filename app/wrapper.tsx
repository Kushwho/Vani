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
    GetUser({
      axios,
      onSuccess: (data) => {
        auth.setConfig({
          loggedIn: true,
          id: data.data._id,
          email: data.data.email,
          voice: data.data.voice,
        });
      },

      onError: (error) => {
        console.log(error.message);
      },
    });
  }, [axios]);

  return <>{children}</>;
};

export default Wrapper;
