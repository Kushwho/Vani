// src/hooks/useSocket.ts

// src/hooks/useSocket.ts

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { DEFAULT_SESSION_ID } from "@/util/constant";
import useAuthContext from "./useAuthContext";

// Define the structure of the transcription data
export interface TranscriptionData {
  transcription: string;
  audioBinary: ArrayBuffer;
  sessionId: string;
  user: string;
}

// Define the properties that the hook will accept
interface UseSocketProps {
  sessionId: string;
  onTranscriptionUpdate: (data: TranscriptionData) => void;
  onDeepgramOpened: () => void;

  onSpeechStarted: (data: any) => void;
}

// Define the return type of the hook
interface UseSocketReturn {
  emitAudioStream: (data: Blob) => void;
  leaveSession: () => void;
  initializeSocket: () => void;
}

const SOCKET_URL = "wss://backend.vanii.ai";

const useSocket = ({
  sessionId,
  onTranscriptionUpdate,
  onDeepgramOpened,
  onSpeechStarted,
}: UseSocketProps): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();

  // Initialize the socket connection
  const initializeSocket = useCallback(() => {
    // Initialize the socket connection only if it's not already initialized
    if (socketRef.current === null) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const socket = socketRef.current;

      // On successful connection
      socket.on("connect", () => {
        socket.emit("session_start", { sessionId });
        socket.emit("join", {
          sessionId,
          email: auth?.primaryValues.email || "",
          voice: "Deepgram",
        });
      });

      // Handle Deepgram connection opened
      socket.on("deepgram_connection_opened", () => {
        onDeepgramOpened();
      });

      // Handle transcription updates
      socket.on("transcription_update", (data: TranscriptionData) => {
        onTranscriptionUpdate(data);
      });

      // Handle speech started
      socket.on("speech_started", (data: any) => {
        onSpeechStarted(data);
      });

      // Handle connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        // Optionally, implement additional error handling or retries here
      });

      // Handle socket disconnect on page unload
      const handleBeforeUnload = () => {
        if (socketRef.current) {
          socketRef.current.emit("leave", { sessionId });
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup function to disconnect the socket and remove event listeners
      return () => {
        handleBeforeUnload();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [
    sessionId,
    auth,
    onTranscriptionUpdate,
    onDeepgramOpened,
    onSpeechStarted,
  ]);

  useEffect(() => {
    if (sessionId !== DEFAULT_SESSION_ID) {
      const cleanup = initializeSocket();

      // Cleanup on unmount or when sessionId changes
      return () => {
        cleanup ? cleanup() : null;
      };
    }
  }, [sessionId, initializeSocket]);

  // Function to emit audio stream data
  const emitAudioStream = useCallback(
    (data: Blob) => {
      if (socketRef.current) {
        socketRef.current.emit("audio_stream", {
          data,
          sessionId,
        });
      }
    },
    [sessionId]
  );

  // Function to leave the session and disconnect the socket
  const leaveSession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("leave", { sessionId });
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("Left session and disconnected socket");
    }
  }, [sessionId]);

  return { initializeSocket, emitAudioStream, leaveSession };
};

export default useSocket;
