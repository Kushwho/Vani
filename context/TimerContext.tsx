import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

// Timer context interface
interface TimerContextType {
  
  starTimer: ((seconds:number) => void) | undefined;
  currentTime: number | undefined;
}

// Creating the TimerContext
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// TimerProvider component
interface TimerProviderProps {
  children: ReactNode;
  startTime:(limit:number) => void
  currentTime:number
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children, startTime, currentTime }) => {

  return (
    <TimerContext.Provider value={{starTimer:startTime, currentTime }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the TimerContext
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    return {starTimer:undefined, currentTime:undefined} as TimerContextType;
  }
  return context;
};
