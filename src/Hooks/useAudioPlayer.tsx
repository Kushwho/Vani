// useAudioHandler.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { VOICE_OPTIONS } from "@/util/constant";
import { AudioStatus } from "@/Components/Recording/AudioRecorder";

export const useAudioPlayer = (voice: VOICE_OPTIONS) => {
  const [audioStatus, setAudioStatus] = useState<AudioStatus>({
    audioPlayingStatus: false,
    jointStatus: "",
  });

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const audioUrlRef = useRef<string>("");

  const pcmFloatToWavBlob = useCallback(
    async (pcmData: Float32Array, sampleRate: number): Promise<Blob> => {
      const numChannels = 1; // Mono
      const bitDepth = 32;
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = pcmData.length * bytesPerSample;
      const bufferSize = 44 + dataSize; 
      const buffer = new ArrayBuffer(bufferSize);
      const view = new DataView(buffer);

      // Write WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, bufferSize - 8, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 3, true); // AudioFormat 3 for IEEE float
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, "data");
      view.setUint32(40, dataSize, true);

      // Write PCM data
      for (let i = 0; i < pcmData.length; i++) {
        view.setFloat32(44 + i * bytesPerSample, pcmData[i], true);
      }

      return new Blob([buffer], { type: "audio/wav" });
    },
    []
  );

  const playSound = useCallback(
    async (audioBinary: ArrayBuffer) => {
      audioRef.current.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      switch (voice) {
        case "Cartesia": {
          const float32Array = new Float32Array(audioBinary);
          const toPlayFile = await pcmFloatToWavBlob(float32Array, 44100);
          audioUrlRef.current = URL.createObjectURL(toPlayFile);
          break;
        }
        default: {
          // Default is set to Deepgram
          const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
          audioUrlRef.current = URL.createObjectURL(audioBlob);
          break;
        }
      }

      audioRef.current.src = audioUrlRef.current;

      // Event Handlers
      const handlePlay = () => {
        setAudioStatus({
          audioPlayingStatus: true,
          jointStatus: "Responding ... ",
        });
      };

      const handlePauseOrCancel = () => {
        setAudioStatus((prevStatus) => ({
          ...prevStatus,
          audioPlayingStatus: false,
        }));
        URL.revokeObjectURL(audioUrlRef.current);
      };

      const handleEnded = () => {
        setAudioStatus(() => ({
          jointStatus:"Listening",
          audioPlayingStatus: false,
        }));
        URL.revokeObjectURL(audioUrlRef.current);
      };

   

      // Attach event listeners
      audioRef.current.onplay = handlePlay;
      audioRef.current.onpause = handlePauseOrCancel;
      audioRef.current.onended = handleEnded;
      // `oncancel` is not a standard event for audio elements; if needed, handle accordingly
      audioRef.current.onerror = handlePauseOrCancel;

      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    },
    [voice, pcmFloatToWavBlob]
  );

  const pauseAudio = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const resumeAudio = useCallback(() => {
    audioRef.current.play().catch((error) => {
      console.error("Error resuming audio:", error);
    });
  }, []);

  const replayAudio = useCallback(() => {
    audioRef.current.currentTime = 0;
    resumeAudio();
  }, [resumeAudio]);

  // Cleanup on unmount
  
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  return {
    audioStatus,
    setAudioStatus,
    playSound,
    pauseAudio,
    resumeAudio,
    replayAudio,
  };
};
