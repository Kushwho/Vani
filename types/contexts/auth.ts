import { VOICE_OPTIONS } from "@/types/voice-options";
import { Dispatch, SetStateAction } from "react";

export interface AuthContext {
  loggedIn: boolean;
  id: string;
  email: string;
  voice: VOICE_OPTIONS;
}

export interface AuthContextValue {
  config: AuthContext;
  setConfig: Dispatch<SetStateAction<AuthContext>>;
}

export interface AuthContextProviderProps {
  children: React.ReactNode;
}
