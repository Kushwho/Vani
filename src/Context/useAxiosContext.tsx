import axios, { AxiosInstance } from "axios";
import React, { useContext } from "react";

const AxiosContext: React.Context<AxiosInstance> = React.createContext(
  axios.create({
    withCredentials: true,
  })
);

const useAxiosContext = () => useContext(AxiosContext);

export default AxiosContext;
export { useAxiosContext };
