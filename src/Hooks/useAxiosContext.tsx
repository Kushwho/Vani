import { ApiError } from "@/types/ApiError";
import axios, { AxiosError, AxiosInstance } from "axios";
import React, { useContext } from "react";
const instance = axios.create({
  withCredentials: true,
});

const AxiosContext: React.Context<AxiosInstance> =
  React.createContext(instance);

const useAxiosContext = () => useContext(AxiosContext);

export default AxiosContext;
export { useAxiosContext };
