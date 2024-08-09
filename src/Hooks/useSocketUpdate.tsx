import { useEffect, useState, useRef } from "react";
import { socket } from "../services/socket";
import { playAudio } from "../services/MicrophoneService";

interface TranscriptionUpdateData {
  transcription: string;
  audioBinary: string;
  sessionId: string;
}

export function useSocketUpdate() {
  const [audioQueue, setAudioQueue] = useState<ArrayBuffer[]>([]);
  const [isPlayingAudio, setIsAudioPlaying] = useState<boolean>(false);
  const [captions, setCaptions] = useState<string>("");
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingAudioRef = useRef<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioQueueRef.current = audioQueue;
  }, [audioQueue]);

  useEffect(() => {
    isPlayingAudioRef.current = isPlayingAudio;
  }, [isPlayingAudio]);

  useEffect(() => {
    function handleTranscriptionUpdate(data: TranscriptionUpdateData,sessionId:number) {
      const { transcription, audioBinary, sessionId: responseSessionId } = data;

      console.log('Transcription recieved'+transcription);
      setCaptions(transcription)
      console.log(transcription);

      if (responseSessionId === "2") {
        console.log("Transcription:", transcription);
        console.log("Audio binary received");
        setCaptions(transcription);
        enqueueAudio(audioBinary);
      }
    }

    function enqueueAudio(audioBinary: string) {
      if (!audioBinary) return;
      console.log("Audio enqueued");
      const audioBuffer = base64ToArrayBuffer(audioBinary);
      setAudioQueue((prevQueue) => {
        const newQueue = [...prevQueue, audioBuffer];
        if (!isPlayingAudioRef.current) {
          console.log("Starting playback");
          playNextAudio(newQueue);
        }
        console.log("isPlayingAudioRef.current", isPlayingAudioRef.current);
        console.log("New queue length", newQueue.length);
        return newQueue;
      });
    }

    async function playNextAudio(queue: ArrayBuffer[]) {
      if (queue.length === 0) {
        console.log("Queue is empty, setting isPlayingAudio to false");
        setIsAudioPlaying(false);
        return;
      }
      console.log("Queue is not empty, setting isPlayingAudio to true");
      setIsAudioPlaying(true);
      const audioBuffer = queue[0];
      console.log("Playing audio");
      const audio = await playAudio(audioBuffer);
      currentAudioRef.current = audio;
      audio.onended = () => {
        console.log("Audio ended");
        setAudioQueue((prevQueue) => {
          const newQueue = prevQueue.slice(1);
          console.log("New queue length:", newQueue.length);
          setIsAudioPlaying(false);
          playNextAudio(newQueue);
          return newQueue;
        });
      };
    }

    socket.on("transcription_update", handleTranscriptionUpdate);

    return () => {
      socket.off("transcription_update", handleTranscriptionUpdate);
    };
  }, []);

  const clearQueue = () => {
    setAudioQueue([]);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  return { audioQueue, isPlayingAudio, captions, clearQueue };
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
