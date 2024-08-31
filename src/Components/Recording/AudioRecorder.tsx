import React, { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";
import { toast } from "react-toastify";
import { DEFAULT_SESSION_ID, NOT_LOGGED_IN_EMAIL } from "@/util/constant";
import { useNavigate } from "react-router";
import { AudioHandler } from "@/util/AudioHandler";

export type AudioRecorderProps = {
  setHistory: React.Dispatch<React.SetStateAction<ChatHistoryProps>>;
  history: ChatHistoryProps;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ setHistory }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);

  const navigate = useNavigate();
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();

  const [audio] = useState<AudioHandler>(
    AudioHandler.getInstance(auth?.primaryValues.voice || "Deepgram")
  );

  useEffect(() => {
    if (auth?.primaryValues.id) {
      setSessionId(auth.primaryValues.id);
    }
  }, [auth?.primaryValues.id]);

  useEffect(() => {
    if (auth?.primaryValues.email === NOT_LOGGED_IN_EMAIL) {
      toast.success(
        "You are not logged in. Please log in to view this page. Navigating you to the home page"
      );
      setTimeout(() => navigate("/"), 3000);
    }
  }, [auth?.primaryValues.email, navigate]);

  const initializeSocket = useCallback(() => {
    if (sessionId !== DEFAULT_SESSION_ID) {
      socketRef.current = io("wss://backend.vanii.ai");
      
      socketRef.current.on("connect", () => {
        console.log("SendingThisSessionId", sessionId);
        socketRef.current?.emit("session_start", { sessionId });
        socketRef.current?.emit("join", {
          sessionId,
          email: auth?.primaryValues.email || "",
          voice: audio.voice,
        });
      });

      socketRef.current.on("deepgram_connection_opened", () => {
        setIsDeepGramOpened(true);
      });

      socketRef.current.on("transcription_update", (data) => {
        const { transcription, audioBinary, sessionId: responseSessionId, user } = data;
        if (responseSessionId === sessionId) {
          updateCaptions(transcription);
          updateHistory(transcription, user);
          enqueueAudio(audioBinary);
        }
      });

      return () => {
        socketRef.current?.emit("leave", { sessionId });
        socketRef.current?.disconnect();
      };
    }
  }, [sessionId, auth?.primaryValues.email, audio.voice]);

  useEffect(() => {
    const cleanup = initializeSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeSocket]);

  const updateCaptions = (transcription: string) => {
    const captionsElement = document.getElementById("captions");
    if (captionsElement) {
      captionsElement.innerHTML = transcription;
    }
  };

  const updateHistory = (transcription: string, user: string) => {
    setHistory((prevHistory) => ({
      messages: [
        ...prevHistory.messages,
        { id: sessionId, sender: "other", content: transcription },
        { id: sessionId, sender: "me", content: user },
      ],
    }));
  };

  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new MediaRecorder(stream, { mimeType: "audio/webm" });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  };

  const openMicrophone = async (socket: Socket) => {
    return new Promise<void>((resolve) => {
      if (!microphoneRef.current) return;
      
      microphoneRef.current.onstart = () => {
        console.log("Microphone opened");
        document.body.classList.add("recording");
        resolve();
      };
      
      microphoneRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_stream", { data: event.data, sessionId });
        }
      };

      microphoneRef.current.start(500);
    });
  };

  const startRecording = async () => {
    setIsRecording(true);
    const microphone = await getMicrophone();
    microphoneRef.current = microphone;
    await openMicrophone(socketRef.current!);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    document.body.classList.remove("recording");
    audio.pauseAudio();
    if (microphoneRef.current) {
      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      microphoneRef.current = null;
    }
  };

  const enqueueAudio = async (audioBinary: ArrayBuffer) => {
    await audio.playSound(audioBinary);
  };

  const handleRecordButtonClick = async () => {
    if (!isRecording) {
      try {
        await startRecording();
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  return (
    <button
      className={`${
        isRecording
          ? "relative grid place-items-center p-8"
          : `m-auto mt-16 h-48 aspect-square border rounded-full font-satoshiMedium text-md ${
              isDeepgramOpened
                ? "bg-primary-100 border-primary-400"
                : "bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed"
            }`
      }`}
      onClick={() => {
        if (isDeepgramOpened) handleRecordButtonClick();
      }}
      disabled={!isDeepgramOpened}
    >
      {isRecording ? (
        <>
          <Player
            autoplay
            loop
            src="/assets/icons/circle-wave.json"
            className="h-[450px] aspect-square"
          />
          <img
            src="/assets/icons/mic-outline.svg"
            alt="Microphone icon"
            className="absolute h-20 w-20"
          />
        </>
      ) : (
        <p className="text-xl font-semibold ">START</p>
      )}
    </button>
  );
};

export default AudioRecorder;