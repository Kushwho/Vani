import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { socket } from "@/services/socket";
import {
  getMicrophone,
  openMicrophone,
} from "../../services/MicrophoneService";


// Define the props type
interface RecordBtnProps {
  clearQueue: () => void;
}

const RecordBtn: React.FC<RecordBtnProps> = ({ clearQueue }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  async function handleStartRecording() {
    try {
      socket.emit("join", { sessionId: "2" });
      setIsRecording(true);
      const mic = await getMicrophone();
      setMicrophone(mic);
      console.log("Client: Waiting to open microphone");
      await openMicrophone(mic, socket);
    } catch (err) {
      setIsRecording(false);
    }
  }

  async function handleStopRecording() {
    if (isRecording) {
      clearQueue();
      socket.emit("leave", { sessionId: "2" });
      microphone?.stop();
      microphone?.stream.getTracks().forEach((track) => track.stop());
      socket.emit("toggle_transcription", { action: "stop" });
      setIsRecording(false);
      setMicrophone(null);
      console.log("Client: Microphone closed");
      document.body.classList.remove("recording");
    }
  }

  function handleClick() {
    if (!isRecording) {
      socket.emit("toggle_transcription", { action: "start", sessionId: "2" });
      handleStartRecording().catch((error) =>
        console.error("Error starting recording:", error)
      );
    } else {
      handleStopRecording().catch((error) =>
        console.error("Error stopping recording:", error)
      );
    }
  }

  return (
    <button
      className={`${
        isRecording
          ? "relative grid place-items-center p-8"
          : "m-auto mt-16 h-40 aspect-square bg-primary-100 border border-primary-400 rounded-full font-satoshiMedium text-md"
      }`}
      onClick={handleClick}
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

export default RecordBtn;
