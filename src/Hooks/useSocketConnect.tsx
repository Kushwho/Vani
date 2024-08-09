import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export function useSocketConnect() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function handleConnect() {
      socket.emit("session_start", { sessionId: "2" });
      socket.emit("join", { sessionId: "2" });
      setIsConnected(true);
    }

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  return { isConnected };
}
