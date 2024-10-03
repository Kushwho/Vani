import React, {
  useState,
  useEffect,
  useRef,
  Ref,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useMemo,
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

function createLinear16Stream(duration: number): Uint8Array {
  function writeString(view: DataView, offset: number, string: string): void {
    for (let i: number = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  const sampleRate: number = 44100; // Standard sample rate (Hz)
  const numChannels: number = 1; // Mono
  const bytesPerSample: number = 2; // 16-bit = 2 bytes

  const numSamples: number = Math.floor(sampleRate * duration);
  const dataSize: number = numSamples * numChannels * bytesPerSample;
  const fileSize: number = 44 + dataSize; // 44 bytes for header + data size

  // Create a buffer for the entire file
  const buffer: ArrayBuffer = new ArrayBuffer(fileSize);
  const view: DataView = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, "RIFF"); // ChunkID
  view.setUint32(4, fileSize - 8, true); // ChunkSize
  writeString(view, 8, "WAVE"); // Format
  writeString(view, 12, "fmt "); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
  view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
  view.setUint16(34, 8 * bytesPerSample, true); // BitsPerSample
  writeString(view, 36, "data"); // Subchunk2ID
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write zero-filled payload (silence)
  for (let i: number = 44; i < fileSize; i++) {
    view.setUint8(i, 0);
  }

  return new Uint8Array(buffer);
}
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
  const timeInterValIdRef = useRef<NodeJS.Timeout | null>(null);

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const audioPlayerRef = useRef<AudioHandler>(
    AudioHandler.getInstance(
      auth?.primaryValues.voice || "Deepgram",
      audioPlaying,
      setAudioPlaying
    )
  );

<<<<<<< HEAD
  const audioProcessorRef = useRef<AudioFilter | null>(null);

  console.log("auth primary values", auth?.primaryValues);

  console.log(auth?.primaryValues.id);
=======
  const duration = 0.1;
  const linearAudio16Stream = useMemo(() => {
    return createLinear16Stream(duration);
  }, [duration]);
  useEffect(() => {
    console.log(linearAudio16Stream);
  }, []);
>>>>>>> main

  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);
  useEffect(() => {}, [sessionId]);
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
        if (timeInterValIdRef.current) {
          clearInterval(timeInterValIdRef.current);
          timeInterValIdRef.current = null;
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      const initializeAudioProcessor = async () => {
        audioProcessorRef.current = await AudioFilter.getInstance();
        audioProcessorRef.current.setProcessedAudioCallback((data) => {
          console.log("Sending data", data);
          console.log(socketRef.current);
          
          socketRef.current?.emit("audio_stream", {
            data: data,
            sessionId,
          });
        });
      };
      initializeAudioProcessor();

      return () => {
        handleBeforeUnload();
        timeInterValIdRef.current? clearInterval(timeInterValIdRef.current):"";
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [sessionId]);

  const onClickEndSession = () => {
    socketRef.current?.emit("leave", { sessionId });
    socketRef.current?.disconnect();
  };
  useImperativeHandle(ref, () => ({
    onClickEndSession,
  }));

<<<<<<< HEAD
=======
  const openMicrophone = async (socket: Socket) => {
    return new Promise<void>((resolve) => {
      microphoneRef.current!.onstart = () => {
        console.log("Microphone opened");
        document.body.classList.add("recording");
        resolve();
      };
      microphoneRef.current!.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_stream", { data: event.data, sessionId });
        }
      };

      microphoneRef.current!.start(100);
    });
  };

  const startRecording = async () => {
    setIsRecording(true);
    if (timeInterValIdRef.current) {
      clearInterval(timeInterValIdRef.current);
    }

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
    setIsRecording(false);
    document.body.classList.remove("recording");
    audioPlayerRef.current.pauseAudio();
    microphoneRef.current?.pause();
    microphoneRef.current?.stop();
    microphoneRef.current?.stream.getTracks().forEach((track) => track.stop());
    microphoneRef.current = null;
    if (timeInterValIdRef.current != null) {
      clearInterval(timeInterValIdRef.current);
    }
    timeInterValIdRef.current = setInterval(() => {
      socketRef.current?.emit("audio_stream", {
        data: linearAudio16Stream,
        sessionId,
      });
    }, 100);
  };

>>>>>>> main
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
      // timeInterValIdRef.current = setInterval(() => {
      //   console.log("Sending 16 audio stream");
      //   socketRef.current?.emit("audio_stream", {
      //     data: audioProcessorRef.current?.getLinear16Stream(),
      //     sessionId,
      //   });
      // }, 100);
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
