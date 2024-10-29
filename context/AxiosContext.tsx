"use client";

import axios, { AxiosInstance } from "axios";
import { createContext, ReactNode } from "react";
import 'dotenv/config'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
