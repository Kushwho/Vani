import React, { useState, useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export type AudioRecorderProps = {
  setHistory: React.Dispatch<React.SetStateAction<ChatHistoryProps>>;
  history: ChatHistoryProps;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ setHistory }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const navigate = useNavigate();
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();
  if (!auth?.primaryValues.loggedIn) {
    setTimeout(() => {
      navigate("/");
    }, 3000);
    toast.success(
      "You are not logged in.Please Log in to view this page.Navigating you to home page"
    );
  }
  console.log("auth primary values", auth?.primaryValues);

  console.log(auth?.primaryValues.id);

  const [sessionId] = useState<string>(auth?.primaryValues.id || "1");
  const [audioPlayer] = useState(new Audio());
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
      socketRef.current?.emit("toggle_transcription", {
        action: "stop",
        sessionId,
      });
      socketRef.current?.emit("leave", { sessionId });
      socketRef.current?.off();
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

  // ...

  const playAudio = async (audioBinary: ArrayBuffer) => {
    try {
      const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayer.pause();
      audioPlayer.src = audioUrl;

      audioPlayer.onpause = () => {
        URL.revokeObjectURL(audioUrl);
      };
      audioPlayer.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      audioPlayer.oncancel = () => {
        URL.revokeObjectURL(audioUrl);
      };

      try {
        await audioPlayer.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // ...

  const handleRecordButtonClick = () => {
    if (!isRecording) {
      socketRef.current?.emit("toggle_transcription", {
        action: "start",
        sessionId,
        email: auth?.primaryValues.email || "",
        voice: "Deepgram",
      });
      startRecording()
        .then(() => {})
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
          : "m-auto mt-16 h-48 aspect-square bg-primary-100 border border-primary-400 rounded-full font-satoshiMedium text-md"
      }`}
      onClick={handleRecordButtonClick}
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
