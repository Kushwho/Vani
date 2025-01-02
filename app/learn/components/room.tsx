"use client";
import { ChatMessageType } from "@/types/chats";
import {

  TrackToggle,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTrackToggle,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { ConnectionState } from "livekit-client";
import React, { useCallback, useEffect, useState } from "react";
import { TranscriptionTile } from "./transcriptions/TranscriptionTile";
import FeedbackModal from "./FeedbackModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLivekitContext } from "@/hooks/custom/useLivekitContext";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import { Dialog } from "@radix-ui/react-dialog";
// import MicrophoneButton from "./audio/MicrophoneButton";

import { cn } from "@/lib/utils";
import AudioVisualizerComponent from "./audio/AudioInputTile";

const Room = () => {
  const voiceAssistant = useVoiceAssistant();
  const roomState = useConnectionState();
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  const [_, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { config, setConfig } = useLivekitContext();
  const isMobile = useMediaQuery("screen and (max-width: 768px)");

  const { enabled } = useTrackToggle({ source: Track.Source.Microphone });

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant, roomState]);

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

  useDataChannel(onDataReceived);
  const leaveSession = useCallback(() => {
    setConfig({
      ...config,
      isConnected: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setConfig]);

  return (
    <>
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-2 h-screen">
        <Dialog>
          {" "}
          <FeedbackModal
            isOpen={feedbackModalOpen}
            cleanupFunction={leaveSession}
          />
        </Dialog>

        <Card className="w-full bg-white shadow-none border-none rounded-t-xl rounded-b-none overflow-hidden md:h-1/6 min-h-[16rem]">
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
              disabled={
                config.isConnected && voiceAssistant.audioTrack ? false : true
              }
            >
              {config.isConnected && voiceAssistant.audioTrack
                ? "End Session"
                : "Not Connected"}
            </Button>

            {/* Voice Controls */}
            <div className="flex flex-col items-center gap-8 mt-8">
              <div className="flex items-center gap-8 w-full max-w-3xl">
                <div className="flex items-center justify-center w-12 mx-auto">
                  {/* <AudioVisualizerComponent /> */}
                  <TrackToggle
                    source={Track.Source.Microphone}
                    showIcon={false}
      
                  >
                                <AudioVisualizerComponent/>
                  </TrackToggle>

                </div>

              </div>



              {/* Assistant Info */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Vanii</h1>
                <h2 className="text-gray-600" id="captions"></h2>
              </div>
            </div>
          </div>
        </Card>

        {/* Transcription Section */}
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
      </main>
    </>
  );
};

export default Room;
