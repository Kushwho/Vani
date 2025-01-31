"use client";
import { ChatMessageType } from "@/types/chats";
import {
  TrackToggle,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { ConnectionState } from "livekit-client";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TranscriptionTile } from "./transcriptions/TranscriptionTile";
import FeedbackModal from "../../learn/components/FeedbackModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLivekitContext } from "@/hooks/custom/useLivekitContext";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import { Dialog } from "@radix-ui/react-dialog";
// import MicrophoneButton from "./audio/MicrophoneButton";

import { cn } from "@/lib/utils";
import AudioVisualizerComponent from "./audio/AudioInputTile";
import { useTimerStore } from "@/app/components/demo/TimerStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DeleteLiveKitRoom } from "@/lib/apis/learn/delete-room";
import useAxiosContext from "@/hooks/custom/useAxiosContext";

interface RoomProps {
  showChat: boolean;
}

const Room: FC<RoomProps> = ({ showChat }) => {
  const voiceAssistant = useVoiceAssistant();
  const roomState = useConnectionState();
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  const [_, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { config, setConfig } = useLivekitContext();
  const isMobile = useMediaQuery("screen and (max-width: 768px)");

  const { currentTime } = useTimerStore();

  const toggleTimerRef = useRef(useTimerStore.getState().toggleTimer);
  const { toast } = useToast();
  const router = useRouter();
  const axios = useAxiosContext();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(false);
    }
  }, [roomState]);

  const onDataReceived = useCallback(
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        console.log(decoded.text);

        setTranscripts((prevTranscripts) => [
          ...prevTranscripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [setTranscripts]
  );

  const isSessionActive = useMemo(
    () => config.isConnected && !!voiceAssistant.audioTrack,
    [config.isConnected, voiceAssistant.audioTrack]
  );

  useDataChannel(onDataReceived);
  const leaveSession = useCallback(() => {

    setFeedbackModalOpen(false)

    DeleteLiveKitRoom({
      axios,
      onSuccess: () => {
        setConfig((prevConfig) => ({
          ...prevConfig,
          isConnected: false,
        }));
      },
      onError: (e) => {console.log(e);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setConfig, axios]);

  return (
    <>
      <main
        className={cn(
          "flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-2",
          showChat && "h-screen"
        )}
      >
        <Dialog>
          {" "}
          <FeedbackModal
            isOpen={feedbackModalOpen}
            cleanupFunction={leaveSession}
          />
        </Dialog>

        <Card
          className="w-full bg-background1682
         shadow-none border-none rounded-t-xl rounded-b-none overflow-hidden md:h-1/6 min-h-[16rem]"
        >
          {/* Main Content Section */}
          <div className="relative p-4">
            {/* End Session Button */}
            <Button
              onClick={() => {
                leaveSession();
                setFeedbackModalOpen(true);
              }}
              className={`${
                !isMobile ? "absolute top-4 right-4" : "mt-2 mx-auto "
              }  "bg-red-500 hover:bg-red-600 disabled:text-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed" transition-colors duration-200`}
              disabled={!isSessionActive}
            >
              {!isSessionActive ? "End Session" : "Not Connected"}
            </Button>

            {/* Voice Controls */}
            <div className="flex flex-col items-center gap-8 mt-8">
              <div className="flex items-center gap-8 w-full max-w-3xl">
                <div className="flex items-center justify-center  mx-auto ">
                  {/* <AudioVisualizerComponent /> */}
                  <TrackToggle
                    source={Track.Source.Microphone}
                    showIcon={false}
                    className="max-w-32 w-full bg-red-300"
                    onChange={(enabled, isUserInitiated) => {
                      if (isUserInitiated) {
                        toggleTimerRef.current(
                          300,
                          toast,
                          router,
                          leaveSession
                        );
                      }
                    }}
                  >
                    <AudioVisualizerComponent />
                  </TrackToggle>
                </div>
              </div>

              {/* Assistant Info */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Vanii</h1>
                {!showChat &&  <h2 className="text-gray-600">
                  {currentTime &&
                    (currentTime > 60
                      ? `${Math.round(currentTime / 60)}:${
                          currentTime % 60
                        } minutes`
                      : `${currentTime} seconds`)}
                </h2>}
              </div>
            </div>
          </div>
        </Card>

        {/* Transcription Section */}
        {showChat ? (
          <div
            className={cn(
              "w-full rounded-b-xl overflow-hidden border-none bg-white  border-t-0 ",
              voiceAssistant.audioTrack ? "h-3/5" : "h-fit py-8"
            )}
          >
            <div className="h-full bg-white">
              {voiceAssistant.audioTrack ? (
                <>
                  <TranscriptionTile
                    agentAudioTrack={voiceAssistant.audioTrack}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-black">
                  <p className="text-lg font-medium">
                    Unable to connect to the Vanii :(
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export default Room;
