import { Dispatch, SetStateAction } from "react";

export type LivekitContextType = {
  isConnected: boolean;
  roomName: string;
  token: string;
  serverUrl: string;
  audioOn: boolean;
  sessionId?: string;
};

export type LivekitContextValue = {
  config: LivekitContextType;
  setConfig: Dispatch<SetStateAction<LivekitContextType>>;
};

export interface LivekitContextProviderProps {
  children: React.ReactNode;
  value: LivekitContextValue;
}
