import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ChatHistory, { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";

import { toast } from "react-toastify";
import { DEFAULT_SESSION_ID } from "@/util/constant";
import { useNavigate } from "react-router";
import Test from "@/routes/Recorder";
import { useAudioPlayer } from "@/Hooks/useAudioPlayer";
import FeedbackModal from "./FeebackModal";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import ApiResponse from "@/types/ApiResponse";
import HeroSection from "../Home/HeroSection";
import AboutUs from "../Home/AboutUs";
import Features from "../Home/Features";

export type AudioStatus = {
  audioPlayingStatus: boolean;
  jointStatus: string;
};

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const {
    setAudioStatus,
    audioStatus,
    playSound,
    pauseAudio,
    resumeAudio,
    replayAudio,
  } = useAudioPlayer("Deepgram");
  const axios = useAxiosContext();
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const { dimensions } = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width < 768, [dimensions.width]);

  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });

  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();

  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);
  useEffect(() => {
    if (auth?.primaryValues.id) {
      setSessionId(auth?.primaryValues.id);
    }
  }, [auth?.primaryValues.id]);

  // Usage
  const audioSubmitterButton = useCallback(
    (data: Blob) => {
      socketRef.current?.emit("audio_stream", {
        data,
        sessionId,
      });
    },
    [sessionId]
  );

  useEffect(() => {
    if (sessionId !== DEFAULT_SESSION_ID) {
      socketRef.current = io("wss://backend.vanii.ai", {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("session_start", { sessionId });

        socketRef.current?.emit("join", {
          sessionId,
          email: auth?.primaryValues.email || "",
          voice: "Deepgram",
        });
      });
      socketRef.current.on("deepgram_connection_opened", () => {
        setIsDeepGramOpened(true);
        setAudioStatus({
          ...audioStatus,
          jointStatus: "Connected",
        });
      });

      socketRef.current.on("transcription_update", (data) => {
        const {
          transcription,
          audioBinary,
          sessionId: responseSessionId,
          user,
        } = data;

        if (responseSessionId === sessionId) {
          const captionsElement = document.getElementById("captions");
          if (captionsElement) {
            captionsElement.innerHTML = transcription;
          }
          playSound(audioBinary);
          setMessages((prevHistory) => ({
            messages: [
              ...prevHistory.messages,
              { id: sessionId, sender: "other", content: transcription },
              { id: sessionId, sender: "me", content: user },
            ],
          }));
        }
      });

      socketRef.current.on("speech_started", (data) => {
        console.log(data);

        pauseAudio();
      });
      const handleBeforeUnload = () => {
        socketRef.current?.emit("leave", { sessionId });
        socketRef.current?.disconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        handleBeforeUnload();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [sessionId]);

  const onClickEndSession = () => {
    socketRef.current?.emit("leave", { sessionId });
    socketRef.current?.disconnect();
  };

  return (
    <>
      <main className="flex flex-col items-center w-full">
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onSubmit={async (data) => {
            const toFed = { ...data, aiUnderstanding: data.personalisation };
            delete toFed.personalisation;
            const resp = await axios.post<ApiResponse<any>>(
              "https://backend.vanii.ai/auth/api/v1/user/post-review",
              toFed
            );
            console.log(resp);

            if (resp.data.success) {
              onClickEndSession();
              toast("Thanks for using.Navigating to home page.");
              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              toast("Error Sending response");
            }
          }}
        />
        <div className="min-h-[480px] relative flex flex-col gap-6 justify-center items-center max-w-6xl w-full">
          <button
            className={`${
              !isMobile ? "absolute top-6 right-0" : "mt-6"
            } max-xl:right-20 bg-red-600 text-gray-100 p-2 px-4 rounded-md `}
            onClick={() => {
              onClickEndSession();
              setFeedbackModalOpen(true);
            }}
          >
            End Session
          </button>
          <div className="relative max-md:p-8">
            <Test
              isDisabled={isDeepgramOpened}
              resultFxn={audioSubmitterButton}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            <div className="flex flex-row items-center justify-center mt-2 gap-8">
              <button
                className="h-12 w-12 rounded-full border border-1  flex items-center justify-center p-2"
                onClick={() => {
                  audioStatus.audioPlayingStatus ? pauseAudio : resumeAudio();
                }}
              >
                <img
                  src={`/assets/icons/${
                    audioStatus.audioPlayingStatus ? "pause.svg" : "play.svg"
                  }`}
                />
              </button>
              <button
                className="h-12 w-12 rounded-full border border-1  flex items-center justify-center p-2"
                onClick={() => {
                  replayAudio();
                }}
              >
                <img src={`/assets/icons/replay.svg`} />
              </button>
            </div>
            <div className="flex items-center justify-center mt-6">
              <h1 className="heading font-semibold text-xl">Vanii</h1>
              <h2 className="captions" id="captions"></h2>
            </div>
            <div className="flex items-center justify-center mt-6">
              <h1 className="heading text-sm">{audioStatus.jointStatus}</h1>
            </div>
          </div>
        </div>
      </main>
      <>
        {auth?.primaryValues.loggedIn ? (
          <ChatHistory messages={messages.messages} />
        ) : (
          <>
            <HeroSection />
          </>
        )}
        <AboutUs />
        <Features />
      </>
    </>
  );
};

export default AudioRecorder;
