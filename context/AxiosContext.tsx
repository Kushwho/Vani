"use client"

import { BACKEND_URL } from "@/lib/constants";
import axios, { AxiosInstance } from "axios";
import { createContext, ReactNode } from "react";

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

const AxiosContext = createContext<AxiosInstance>(instance);

const AxiosContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>
  );
};

export { AxiosContextProvider };
export default AxiosContext;
