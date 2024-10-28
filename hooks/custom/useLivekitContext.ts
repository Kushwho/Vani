import { LivekitContext } from "@/context/LivekitContext";
import { useContext } from "react";

const useLivekitContext = () => {
  const context = useContext(LivekitContext);
  if (context === undefined) {
    throw new Error("useLivekitContext must be used within a LivekitProvider");
  }
  return context;
};


export {useLivekitContext}  ;