import React, { useState, useEffect, useRef, Dispatch } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";
import getMicrophone from "@/services/MicrophoneService/GetMicrophone";
import { MySocket } from "@/services/socket";
import OpenMicrophone from "@/services/MicrophoneService/OpenMicrophone";
import useAuthContext, { AuthContext } from "@/Hooks/useAuthContext";

export type AudioRecorderProps = {
  setHistory: Dispatch<ChatHistoryProps>;
  history: ChatHistoryProps;
};
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setHistory,
  history,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [_audioQueue, setAudioQueue] = useState<ArrayBuffer[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [_, setIsDeepGramConnectionOpened] = useState<boolean>(false);
  const microphoneRef = useRef<MediaRecorder | null>(null);
  const auth = useAuthContext();
  const [sessionId, _setSessionId] = useState<string>(
    auth?.primaryValues.id || "1"
  );
  const [socket, setSocket] = useState<MySocket>();

  useEffect(() => {
    setSocket(() => {
      const tempSock = MySocket.getInstance();
      console.log("Hello");

      tempSock.onConnect(() => {
        // TODO: comment these two line
        tempSock.emit("session_start", { sessionId });
        tempSock.emit("join", { sessionId });
        console.log("Connected with session id ", tempSock.getId());
      });

      // TODO: Working in future uncomment it.Waiting for backend
      // socket.on("sessionId", (data: { sessionId: string }) => {
      //   setSessionId(data.sessionId);
      // });

      tempSock.onTranscriptionUpdate((data: any) => {
        const {
          transcription,
          user,
          audioBinary,
          sessionId: responseSessionId,
        } = data;
        console.log(data);

        if (responseSessionId === sessionId) {
          const captionsElement = document.getElementById("captions");
          if (captionsElement) {
            captionsElement.innerHTML = transcription;
            setHistory({
              messages: [
                ...history.messages,
                { id: sessionId, sender: "me", content: user },
                { id: sessionId, sender: "other", content: transcription },
              ],
            });

            enqueueAudio(audioBinary);
          }
        }
      });

      return tempSock;
    });

    return () => {
      socket?.off("connect");
      socket?.off("transcription_update");
    };
  }, []);

  const startRecording = async () => {
    socket?.emit("join", { sessionId });
    setIsRecording(true);
    const microphone = await getMicrophone();
    microphoneRef.current = microphone;

    socket?.onDeepGramConnectionOpen(async () => {
      setIsDeepGramConnectionOpened(true);
      await OpenMicrophone(
        microphone,
        () => {
          document.body.classList.add("recording");
        },
        (event: BlobEvent) => {
          socket?.emit("audio_stream", { data: event.data, sessionId });
        }
      );
    });
  };

  const stopRecording = async () => {
    if (isRecording && microphoneRef.current) {
      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsDeepGramConnectionOpened(false);
      socket?.emit("toggle_transcription", { action: "stop", sessionId });
      socket?.emit("leave", { sessionId });
      setIsRecording(false);
      microphoneRef.current = null;
      document.body.classList.remove("recording");
    }
  };

  const enqueueAudio = (audioBinary: ArrayBuffer) => {
    setAudioQueue((prevQueue) => {
      const newQueue = [...prevQueue, audioBinary];
      return newQueue;
    });
    if (!isPlayingAudio) {
      playAudio(audioBinary);
    }
  };

  const playNextAudio = async (audioQue: ArrayBuffer[]) => {
    console.log(audioQue);

    if (audioQue.length === 0) {
      setIsPlayingAudio(false);
      setAudioQueue([]);
      return;
    }

    setIsPlayingAudio(true);
    const audioBinary = audioQue[audioQue.length - 1];

    try {
      await playAudio(audioBinary);
      playNextAudio(audioQue.slice(0, audioQue.length - 1)); // Continue to the next audio
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  const playAudio = async (audioBinary: ArrayBuffer) => {
    try {
      if (!audioBinary) throw new Error("No audio data received");

      // Create a Blob from the ArrayBuffer
      const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
      console.log("Created Blob:", audioBlob);

      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Audio URL:", audioUrl);

      // Create an Audio element and set its source to the Blob URL
      const audioElement = new Audio(audioUrl);

      // Play the audio
      await new Promise<void>((resolve, reject) => {
        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(); // Resolve the promise when audio finishes
        };
        audioElement.onerror = (event) => {
          console.error("Error playing audio:", event);
          URL.revokeObjectURL(audioUrl);
          reject(new Error("Error playing audio"));
        };
        audioElement.play().catch((error) => {
          console.error("Error starting playback:", error);
          URL.revokeObjectURL(audioUrl);
          reject(error); // Reject the promise if play fails
        });
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };
  const handleRecordButtonClick = () => {
    if (!isRecording) {
      socket?.emit("toggle_transcription", { action: "start", sessionId });
      startRecording().catch((error) =>
        console.error("Error starting recording:", error)
      );
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
