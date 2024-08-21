import React, { useState, useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";

export type AudioRecorderProps = {
  setHistory: React.Dispatch<React.SetStateAction<ChatHistoryProps>>;
  history: ChatHistoryProps;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setHistory,
}) => {
  const [isRecording, setIsRecording] = useState(false);
 
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();
  const [sessionId] = useState<string>(auth?.primaryValues.id || "1");

  useEffect(() => {
    socketRef.current = io("wss://backend.vanii.ai");

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("session_start", { sessionId });
      socketRef.current?.emit("join", { sessionId });
    });

    socketRef.current.on("transcription_update", (data) => {
      const {
        transcription,
        audioBinary,
        sessionId: responseSessionId,
        user,
      } = data;
      console.log(responseSessionId);
      console.log(data);
      if (responseSessionId === sessionId) {
        const captionsElement = document.getElementById("captions");
        if (captionsElement) {
          captionsElement.innerHTML = transcription;
        }
        setHistory((prevHistory) => ({
          messages: [
            ...prevHistory.messages,
            { id: sessionId, sender: "other", content: transcription },
            { id: sessionId, sender: "me", content: user },
          ],
        }));
        enqueueAudio(audioBinary);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new MediaRecorder(stream, { mimeType: "audio/webm" });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  };

  const openMicrophone = async (microphone: MediaRecorder, socket: Socket) => {
    return new Promise<void>((resolve) => {
      microphone.onstart = () => {
        console.log("Client: Microphone opened");
        document.body.classList.add("recording");
        resolve();
      };
      microphone.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_stream", { data: event.data, sessionId });
        }
      };
      microphone.start(1000);
    });
  };

  const startRecording = async () => {
    socketRef.current?.emit("join", { sessionId });
    setIsRecording(true);
    const microphone = await getMicrophone();
    microphoneRef.current = microphone;

    socketRef.current?.on("deepgram_connection_opened", async () => {
      console.log("Deepgram connection opened");
      await openMicrophone(microphone, socketRef.current!);
    });
  };

  const stopRecording = async () => {
    if (isRecording && microphoneRef.current) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
     
      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      socketRef.current?.emit("toggle_transcription", {
        action: "stop",
        sessionId,
      });
      socketRef.current?.emit("leave", { sessionId });
      microphoneRef.current = null;
      setIsRecording(false);
      document.body.classList.remove("recording");
    }
  };

  const enqueueAudio = (audioBinary: ArrayBuffer) => {

    playAudio(audioBinary);

  };

 

  const playAudio = async (audioBinary: ArrayBuffer) => {
    try {
      const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      return new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          resolve();
        });
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

 

  const handleRecordButtonClick = () => {
    if (!isRecording) {
      socketRef.current?.emit("toggle_transcription", {
        action: "start",
        sessionId,
        email: "aswanib133@gmail.com",
        voice: "Deepgram",
      });
      startRecording()
        .then(() => {
        })
        .catch((error) => console.error("Error starting recording:", error));
    } else {
      stopRecording().catch((error) =>
        console.error("Error stopping recording:", error)
      );
    }
  };

  return (
    <button
      className={`${
        isRecording
          ? "relative grid place-items-center p-8"
          : "m-auto mt-16 h-40 aspect-square bg-primary-100 border border-primary-400 rounded-full font-satoshiMedium text-md"
      }`}
      onClick={handleRecordButtonClick}
    >
      {isRecording ? (
        <>
          <Player
            autoplay
            loop
            src="/assets/icons/circle-wave.json"
            className="h-80 aspect-square"
          />
          <img
            src="/assets/icons/mic-outline.svg"
            alt="Microphone icon"
            className="absolute h-16 w-16"
          />
        </>
      ) : (
        <p>START</p>
      )}
    </button>
  );
};

export default AudioRecorder;
