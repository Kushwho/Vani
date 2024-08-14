import { FC } from "react";
import axios, { AxiosError } from "axios";
import AxiosContext from "./Hooks/useAxiosContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { WindowDimensionsProvider } from "./Hooks/useWindowDimensions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiError } from "./types/ApiError";

const App: FC = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError): Promise<ApiError> => {
      const apiError: ApiError = error.response?.data as ApiError;
      return Promise.reject(apiError);
    }
  );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AxiosContext.Provider value={axiosInstance}>
        <WindowDimensionsProvider>
          <AppRoutes />
        </WindowDimensionsProvider>
      </AxiosContext.Provider>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
