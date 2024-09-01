import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import { io, Socket } from "socket.io-client";
import useAuthContext from "@/Hooks/useAuthContext";

import { toast } from "react-toastify";
import { DEFAULT_SESSION_ID, NOT_LOGGED_IN_EMAIL } from "@/util/constant";
import { useNavigate } from "react-router";
import { AudioHandler } from "@/util/AudioHandler";

export type RefProps = {
  onClickEndSession: () => void;
};

export type AudioRecorderProps = {
  setHistory: React.Dispatch<React.SetStateAction<ChatHistoryProps>>;
  history: ChatHistoryProps;
  ref: Ref<RefProps>;
};

const SilentAudio = (): Buffer => {
  const sampleRate = 16000; // typical sample rate for LINEAR16 audio
  const durationInMilliseconds = 500; // 500ms of silence
  const numChannels = 1; // mono audio
  const bitDepth = 16; // 16 bits per sample

  // Calculate the total number of samples for the duration
  const totalSamples =
    ((sampleRate * durationInMilliseconds) / 1000) * numChannels;

  // Create a buffer filled with zeros (silent audio) only once
  return Buffer.alloc(totalSamples * (bitDepth / 8));
};

function AudioRecorder({ setHistory, ref }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate();
  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);

  const microphoneRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuthContext();
  const silentAudioBuffer = useRef<Buffer>(SilentAudio());
  const [stopSessionIntervalId, setStopSessionIntervalId] = useState<
    number | null
  >(null);

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const audioPlayerRef = useRef<AudioHandler>(
    AudioHandler.getInstance(
      auth?.primaryValues.voice || "Deepgram",
      audioPlaying,
      setAudioPlaying
    )
  );

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

  // Usage
  const onClickEndSession = () => {
    socketRef.current?.emit("leave", { sessionId });
    socketRef.current?.disconnect();
  };

  useImperativeHandle(ref, () => ({
    onClickEndSession,
  }));

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

  const openMicrophone = async (socket: Socket) => {
    return new Promise<void>((resolve) => {
      microphoneRef.current!.onstart = () => {
        console.log("Microphone opened");
        document.body.classList.add("recording");
        resolve();
      };
      microphoneRef.current!.ondataavailable = async (event) => {
        console.log(event);

        if (event.data.size > 0) {
          socket.emit("audio_stream", { data: event.data, sessionId });
        }
      };

      microphoneRef.current!.start(500);
    });
  };

  const startRecording = async () => {
    if (stopSessionIntervalId) {
      clearInterval(stopSessionIntervalId);
    }
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      await openMicrophone(socketRef.current!);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  };

  const stopRecording = async () => {
    const sessionId = setInterval(() => {
      socketRef.current?.emit("audio_stream", {
        data: silentAudioBuffer.current,
        sessionId,
      });
    },500);
    setIsRecording(false);
    document.body.classList.remove("recording");
    audioPlayerRef.current.pauseAudio();
    microphoneRef.current?.pause();
    microphoneRef.current?.stop();
    microphoneRef.current?.stream.getTracks().forEach((track) => track.stop());
    microphoneRef.current = null;
  };

  const enqueueAudio = async (audioBinary: ArrayBuffer) => {
    await playAudio(audioBinary);
  };

  // ...

  const playAudio = async (audioBinary: ArrayBuffer) => {
    await audioPlayerRef.current.playSound(audioBinary);
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
    <>
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
      <div className="flex flex-row">
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
      </div>
    </>
  );
}

export default forwardRef(AudioRecorder);
