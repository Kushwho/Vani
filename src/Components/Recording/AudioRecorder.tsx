import { useState, useEffect, useMemo } from "react";
import ChatHistory, { ChatHistoryProps } from "./Chat";
import useAuthContext from "@/Hooks/useAuthContext";

import { DEFAULT_SESSION_ID } from "@/util/constant";
import Test from "@/routes/Recorder";
import { useAudioPlayer } from "@/Hooks/useAudioPlayer";
import FeedbackModal from "./FeebackModal";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import HeroSection from "../Home/HeroSection";
import AboutUs from "../Home/AboutUs";
import Features from "../Home/Features";
import useSocket from "@/Hooks/useSocket";

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
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const { dimensions } = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width < 768, [dimensions.width]);

  const [isDeepgramOpened, setIsDeepGramOpened] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });
  const auth = useAuthContext();

  const [sessionId, setSessionId] = useState<string>(DEFAULT_SESSION_ID);
  useEffect(() => {
    if (auth?.primaryValues.id) {
      setSessionId(auth?.primaryValues.id);
    }
  }, [auth?.primaryValues.id]);

  const { emitAudioStream, leaveSession } = useSocket({
    sessionId,
    onTranscriptionUpdate: (data) => {
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
    },
    onDeepgramOpened: () => {
      setIsDeepGramOpened(true);
      setAudioStatus({
        ...audioStatus,
        jointStatus: "Connected",
      });
    },
    onSpeechStarted: (_) => {
      pauseAudio();
    },
  });

  return (
    <>
      <main className="flex flex-col items-center w-full">
        <FeedbackModal
          isOpen={feedbackModalOpen}
          cleanupFunction={leaveSession}
        />
        <div className="min-h-[480px] relative flex flex-col gap-6 justify-center items-center max-w-6xl w-full">
          <button
            className={`${
              !isMobile ? "absolute top-6 right-0" : "mt-6"
            } max-xl:right-20 bg-red-600 text-gray-100 p-2 px-4 rounded-md `}
            onClick={() => {
              leaveSession();
              setFeedbackModalOpen(true);
            }}
          >
            End Session
          </button>
          <div className="relative max-md:p-8">
            <Test
              isDisabled={!isDeepgramOpened}
              resultFxn={emitAudioStream}
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
