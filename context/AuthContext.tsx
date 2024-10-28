"use client"

import {
  AuthContextProviderProps as AuthContextProviderPropsType,
  AuthContext as AuthContextType,
  AuthContextValue,
} from "@/types/contexts/auth";
import { createContext, useState } from "react";

const defaultConfig: AuthContextType = {
  loggedIn: false,
  id: "",
  email: "",
  voice: "Deepgram",
};

// Create context with proper type
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthContextProviderPropsType) => {
  const [config, setConfig] = useState<AuthContextType>(defaultConfig);

  return (
    <AuthContext.Provider value={{ config, setConfig }}>
      {children}
    </AuthContext.Provider>
  );
};
