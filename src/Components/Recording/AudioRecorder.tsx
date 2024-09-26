import React, {
  useState,
  useEffect,
  useRef,
  Ref,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";

import { toast } from "react-toastify";
import { DEFAULT_SESSION_ID, NOT_LOGGED_IN_EMAIL } from "@/util/constant";
import { useNavigate } from "react-router";
import { AudioHandler } from "@/util/AudioHandler";
import { AudioFilter } from "@/util/AudioFilter";

export type AudioRecorderProps = {
  setHistory: React.Dispatch<React.SetStateAction<ChatHistoryProps>>;
  history: ChatHistoryProps;
};

export type RefProps = {
  onClickEndSession: () => void;
};

const AudioRecorder: ForwardRefRenderFunction<RefProps, AudioRecorderProps> = (
  { setHistory },
  ref: Ref<RefProps>
) => {
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate();

  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);

  const timeInterValIdRef = useRef<NodeJS.Timeout | null>(null);

  // const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const audioPlayerRef = useRef<AudioHandler>(
    AudioHandler.getInstance(
      auth?.primaryValues.voice || "Deepgram",
      audioPlaying,
      setAudioPlaying
    )
  );

  const audioProcessorRef = useRef<AudioFilter | null>(null);

  console.log("auth primary values", auth?.primaryValues);

  console.log(auth?.primaryValues.id);

  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);
  useEffect(() => {
 
  }, [sessionId]);
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
      }, 1500);
    }
  }, [auth?.primaryValues.email, navigate]);

  // Usage

  useEffect(() => {
    if (sessionId !== DEFAULT_SESSION_ID) {
      socketRef.current = io("wss://backend.vanii.ai");

      socketRef.current.on("connect", () => {
        console.log("SendingThisSessionId", sessionId);
        socketRef.current?.emit("session_start", { sessionId });
        console.log(audioPlayerRef.current.voice);

        socketRef.current?.emit("join", {
          sessionId,
          email: auth?.primaryValues.email || "",
          voice: audioPlayerRef.current.voice,
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
          enqueueAudio(audioBinary);
        }
      });

      socketRef.current.on("speech_started", (data) => {
        console.log(data);

        audioPlayerRef.current.pauseAudio();
      });
      const handleBeforeUnload = () => {
        socketRef.current?.emit("leave", { sessionId });
        socketRef.current?.disconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      const initializeAudioProcessor = async () => {
        audioProcessorRef.current = await AudioFilter.getInstance();
        audioProcessorRef.current.setProcessedAudioCallback((data) => {
          console.log("Sending data", data);
  
          socketRef.current?.emit("audio_stream", {
            data: data,
            sessionId,
          });
        });
      };
      initializeAudioProcessor();

      return () => {
        handleBeforeUnload();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [sessionId,auth?.primaryValues.email,setHistory]);

  const onClickEndSession = () => {
    socketRef.current?.emit("leave", { sessionId });
    socketRef.current?.disconnect();
  };
  useImperativeHandle(ref, () => ({
    onClickEndSession,
  }));

  const enqueueAudio = async (audioBinary: ArrayBuffer) => {
    await playAudio(audioBinary);
  };

  // ...

  const playAudio = async (audioBinary: ArrayBuffer) => {
    setAudioPlaying(true);
    await audioPlayerRef.current.playSound(audioBinary);
  };

  // ...

  const handleRecordButtonClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      console.log("Hello");
      if (timeInterValIdRef.current) {
        clearInterval(timeInterValIdRef?.current);
      }

      await audioProcessorRef.current
        ?.startMicrophoneProcessing()
        .catch((err) => {
          setIsRecording(false);
          console.log(err);
        });
    } else {
      setIsRecording(false);
      audioProcessorRef.current?.stopMicrophoneProcessing();
      timeInterValIdRef.current = setInterval(() => {
        console.log("Sending 16 audio stream");
        socketRef.current?.emit("audio_stream", {
          data: audioProcessorRef.current?.getLinear16Stream(),
          sessionId,
        });
      }, 100);
    }
  };

  return (
    <>
      <button
        id="btn-record"
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
      <div className="flex flex-row items-center justify-center mt-2 gap-8">
        <button
          className="h-12 w-12 rounded-full border border-1  flex items-center justify-center p-2"
          onClick={() => {
            audioPlaying
              ? audioPlayerRef.current.pauseAudio()
              : audioPlayerRef.current.resumeAudio();
          }}
        >
          <img
            src={`/assets/icons/${audioPlaying ? "pause.svg" : "play.svg"}`}
          />
        </button>
        <button
          className="h-12 w-12 rounded-full border border-1  flex items-center justify-center p-2"
          onClick={() => {
            audioPlayerRef.current.replayAudio();
          }}
        >
          <img src={`/assets/icons/replay.svg`} />
        </button>
      </div>
    </>
  );
};

export default forwardRef(AudioRecorder);
