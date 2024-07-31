import { FC } from "react";
import axios from "axios";
import AxiosContext from "./Context/useAxiosContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { WindowDimensionsProvider } from "./Context/useWindowDimensions";

const App: FC = () => {
  const instance = axios.create({
    withCredentials: true,
  });

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AxiosContext.Provider value={instance}>
        <WindowDimensionsProvider>
          <AppRoutes />
        </WindowDimensionsProvider>
      </AxiosContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
