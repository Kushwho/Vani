import React, { useState, useEffect, useRef, Dispatch } from "react";
import io from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChatHistoryProps } from "./Chat";

const sessionId = "2";
const socketPort = 5001;
const socket = io(`http://${window.location.hostname}:${socketPort}`);

export type AudioRecorderProps = {
  setHistory: Dispatch<ChatHistoryProps>;
  history: ChatHistoryProps;
};
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setHistory,
  history,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioQueue, setAudioQueue] = useState<ArrayBuffer[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const microphoneRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("session_start", { sessionId });
      socket.emit("join", { sessionId });
    });

    socket.on("transcription_update", (data) => {
      const {
        transcription,
        user,
        audioBinary,
        sessionId: responseSessionId,
      } = data;
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
        }
        enqueueAudio(audioBinary);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("transcription_update");
    };
  }, []);

  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new MediaRecorder(stream, { mimeType: "audio/webm" });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  };

  const openMicrophone = async (microphone: MediaRecorder) => {
    return new Promise<void>((resolve) => {
      microphone.onstart = () => {
        document.body.classList.add("recording");
        resolve();
      };
      microphone.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_stream", { data: event.data, sessionId });
        }
      };
      microphone.start(1000);
    });
  };

  const startRecording = async () => {
    socket.emit("join", { sessionId });
    setIsRecording(true);
    const microphone = await getMicrophone();
    microphoneRef.current = microphone;
    await openMicrophone(microphone);
  };

  const stopRecording = async () => {
    if (isRecording && microphoneRef.current) {
      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      socket.emit("toggle_transcription", { action: "stop", sessionId });
      socket.emit("leave", { sessionId });
      setIsRecording(false);
      microphoneRef.current = null;
      document.body.classList.remove("recording");

      // Start playing queued audio if any
      if (audioQueue.length > 0 && !isPlayingAudio) {
        playNextAudio(audioQueue);
      }
    }
  };

  const enqueueAudio = (audioBinary: ArrayBuffer) => {
    setAudioQueue((prevQueue) => {
      const newQueue = [...prevQueue, audioBinary];
      return newQueue;
    });
  };

  const playNextAudio = async (audioQue: ArrayBuffer[]) => {
    console.log(audioQue);

    if (audioQue.length === 0) {
      setIsPlayingAudio(false);
      setAudioQueue([]);
      return;
    }
    ``;

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
      const audioBlob = new Blob([audioBinary], { type: "audio/webm" });
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
      socket.emit("toggle_transcription", { action: "start", sessionId });
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
