import AxiosContext from "@/context/AxiosContext";

import { useContext } from "react";

const useAxiosContext = () => {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error(
      "useAxiosContext must be used within a AxiosContextProvider"
    );
  }
  return context;
};
export default useAxiosContext;
