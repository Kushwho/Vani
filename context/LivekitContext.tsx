"use client";

import {
  LivekitContextProviderProps,
  LivekitContextType,
  LivekitContextValue,
} from "@/types/contexts/Livekit";
import { createContext } from "react";

export const defaultConfig: LivekitContextType = {
  roomName: "",
  token: "",
  serverUrl: "wss://vanii-490yrzvm.livekit.cloud",
  audioOn: false,
  isConnected: false,
};

export const LivekitContext = createContext<LivekitContextValue | undefined>(
  undefined
);

export const LivekitProvider = ({
  children,
  value,
}: LivekitContextProviderProps) => {
  return (
    <LivekitContext.Provider value={value}>{children}</LivekitContext.Provider>
  );
};
