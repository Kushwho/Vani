import React, { createContext, useContext, useState, useEffect } from "react";

interface WindowDimensions {
  width: number;
  height: number;
}

interface WindowDimensionsContextType {
  dimensions: WindowDimensions;
}

const WindowDimensionsContext = createContext<
  WindowDimensionsContextType | undefined
>(undefined);

interface WindowDimensionsProviderProps {
  children: React.ReactNode;
}

const WindowDimensionsProvider: React.FC<WindowDimensionsProviderProps> = ({
  children,
}) => {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowDimensionsContext.Provider value={{ dimensions }}>
      {children}
    </WindowDimensionsContext.Provider>
  );
};

const useWindowDimensions = () => {
  const context = useContext(WindowDimensionsContext);
  if (context === undefined) {
    throw new Error(
      "useWindowDimensions must be used within a WindowDimensionsProvider"
    );
  }
  return context;
};

export default useWindowDimensions;
export { WindowDimensionsProvider, WindowDimensionsContext };
export type { WindowDimensions, WindowDimensionsContextType };
