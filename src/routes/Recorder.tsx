import { createLinear16Stream } from "@/util/Linear16StreamCreator";
import { Player } from "@lottiefiles/react-lottie-player";
import React, { Dispatch, useMemo, useRef } from "react";

interface RecorderProps {
  isDisabled: boolean;
  resultFxn: (data: Blob) => void;
  isRecording: boolean;
  setIsRecording: Dispatch<React.SetStateAction<boolean>>;
}

const Recorder: React.FC<RecorderProps> = ({
  isDisabled,
  resultFxn,
  isRecording,
  setIsRecording,
}) => {
  const microphoneRef = useRef<MediaRecorder | null>(null);

  const duration = 100;
  const linear16Stream = useMemo<Uint8Array>(() => {
    return createLinear16Stream(duration);
  }, [duration]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    if (intervalId.current) clearInterval(intervalId.current);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      microphoneRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          resultFxn(event.data);
        }
      };
      microphoneRef.current.start(100);
      setIsRecording(true);
    } catch (error) {
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (microphoneRef.current) {
      microphoneRef.current.stop();
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      microphoneRef.current = null;
      setIsRecording(false);
    }

    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = setInterval(() => {
        resultFxn(new Blob([linear16Stream], { type: "audio/webm" }));
      }, 100);
    }
  };

  return (
    <>
      <button
        className={`${
          isRecording
            ? "relative grid place-items-center p-8"
            : `m-auto mt-16 h-48 aspect-square border rounded-full font-satoshiMedium text-md ${isDisabled}
                  ? "bg-primary-100 border-primary-400"
                  : "bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed"
              }`
        }`}
        onClick={() => {
          if (!isDisabled) {
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }
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
    </>
  );
};

export default Recorder;
