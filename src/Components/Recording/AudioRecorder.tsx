import React, { useState, useEffect, useRef } from "react";
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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const navigate = useNavigate();
  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);

  const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();

  const [audio] = useState<AudioHandler>(AudioHandler.getInstance("Cartesia"));
  // if (auth?.primaryValues.loggedIn === false) {
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 3000);

  //   toast.success(
  //     "You are not logged in.Please Log in to view this page.Navigating you to home page"
  //   );
  // }
  console.log("auth primary values", auth?.primaryValues);

  console.log(auth?.primaryValues.id);

  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);
  useEffect(() => {
    if (auth?.primaryValues.id) {
      setSessionId(auth?.primaryValues.id);
    }
  }, [auth?.primaryValues.id]);
  useEffect(() => {
    if (auth?.primaryValues.email === NOT_LOGGED_IN_EMAIL) {
      toast.success(
        "You are not logged in. Please log in to view this page. Navigating you to the home page"
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [auth?.primaryValues.email, navigate]);

  async function setupAudioTrigger(audioBinary: ArrayBuffer) {
    const handleMouseMove = async (_: any) => {
      enqueueAudio(audioBinary);
      document.removeEventListener("mousemove", handleMouseMove);
    };

    document.addEventListener("mousemove", handleMouseMove, { once: true });
  }

  // Usage

  useEffect(() => {
    if (sessionId !== DEFAULT_SESSION_ID) {
      socketRef.current = io("wss://backend.vanii.ai");

      socketRef.current.on("connect", () => {
        console.log("SendingThisSessionId", sessionId);
        socketRef.current?.emit("session_start", { sessionId });
        socketRef.current?.emit("join", {
          sessionId,
          email: auth?.primaryValues.email || "",
          voice: "Cartesia",
        });
      });
      socketRef.current.on("deepgram_connection_opened", () => {
        setIsDeepGramOpened(true);
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

          setupAudioTrigger(audioBinary);
        }
      });
      const handleBeforeUnload = () => {
        socketRef.current?.emit("leave", { sessionId });
        socketRef.current?.disconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
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
    setIsRecording(true);
    const microphone = await getMicrophone();
    microphoneRef.current = microphone;
    await openMicrophone(microphone, socketRef.current!);
  };

  const stopRecording = async () => {
    audio.pauseAudio();
    if (isRecording && microphoneRef.current) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }

      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());

      microphoneRef.current = null;
      setIsRecording(false);
      document.body.classList.remove("recording");
    }
  };

  const enqueueAudio = async (audioBinary: ArrayBuffer) => {
    await playAudio(audioBinary);
  };

  // ...

  const playAudio = async (audioBinary: ArrayBuffer) => {
    await audio.playSound(audioBinary);
  };

  // ...

  const handleRecordButtonClick = () => {
    if (!isRecording) {
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
          : `m-auto mt-16 h-48 aspect-square border rounded-full font-satoshiMedium text-md ${
              isDeepgramOpened
                ? "bg-primary-100 border-primary-400"
                : "bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed"
            }`
      }`}
      onClick={() => {
        console.log("Deepgram Connection", isDeepgramOpened);

        if (isDeepgramOpened) handleRecordButtonClick();
      }}
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
