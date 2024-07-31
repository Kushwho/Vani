import React, { createContext, useContext } from "react";

interface AuthContextType {
  primaryValues: {
    loggedIn: boolean;
    username: string;
  };

  setPrimaryValues: React.Dispatch<
    React.SetStateAction<{
      loggedIn: boolean;
      username: string;
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
export type {AuthContextType}
