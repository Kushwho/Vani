import { VOICE_OPTIONS } from "@/util/constant";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  primaryValues: {
    loggedIn: boolean;
    id: string;
    email: string;
    voice: VOICE_OPTIONS
  };

  setPrimaryValues: React.Dispatch<
    React.SetStateAction<{
      loggedIn: boolean;
      id: string;
      email: string;
      voice: VOICE_OPTIONS
    }>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: React.ReactNode;
  values: AuthContextType;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  values,
}) => {
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
export { AuthContextProvider, AuthContext };
export type { AuthContextType };
