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
import MicrophoneButton from "./audio/MicrophoneButton";
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
      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-8 h-screen">
        <Dialog>
          {" "}
          <FeedbackModal
            isOpen={feedbackModalOpen}
            cleanupFunction={leaveSession}
          />
        </Dialog>

        <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden md:h-3/6">
          {/* Main Content Section */}
          <div className="relative p-8">
            {/* Connection Status */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {config.isConnected ? (
                <>
                  <span className="text-sm text-green-500 font-medium">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-red-500 font-medium">
                    Not Connected
                  </span>
                </>
              )}
            </div>

            {/* End Session Button */}
            <Button
              onClick={() => {
                leaveSession();
                setFeedbackModalOpen(true);
              }}
              className={`${
                !isMobile ? "absolute top-4 right-4" : "mt-6"
              } bg-red-500 hover:bg-red-600 text-white transition-colors duration-200`}
            >
              End Session
            </Button>

            {/* Voice Controls */}
            <div className="flex flex-col items-center gap-8 mt-8">
              <div className="flex items-center gap-8 w-full max-w-3xl">
                <div className="flex items-center justify-center w-16 mx-auto">

                <AudioVisualizerComponent />

                  <TrackToggle
                    source={Track.Source.Microphone}
                    showIcon={false}
                  >
                    <MicrophoneButton
                      isRecording={!enabled}
                      className="w-24 h-24"
                    />
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
        <div className="w-full mt-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-300 shadow-lg h-3/5">
          <div className="h-full bg-black">
            {voiceAssistant.audioTrack ? (
              <>
                <TranscriptionTile
                  agentAudioTrack={voiceAssistant.audioTrack}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
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
