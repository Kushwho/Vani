import React from "react";
import { BarVisualizer, useTracks } from "@livekit/components-react";
import { LocalParticipant, Track } from "livekit-client";
import "@livekit/components-styles";
import MicrophoneButton from "./MicrophoneButton";
import { MicOff } from "lucide-react";

export const AudioVisualizerComponent = () => {
  const tracks = useTracks();

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );

  const localMicTrack = localTracks.find((track) => {
    return track.source === Track.Source.Microphone;
  });

  // if (!localMicTrack) {
  //   return <>no track available</>;
  // }

  return (
    <div
      className={`flex flex-row  w-full h-[100px]  items-center  justify-center  rounded-full  bg-transparent`}
    >
      {!localMicTrack ||
      !localMicTrack?.publication.isEnabled? (
        <>
          <MicOff className="h-20 w-20"/>
        </>
      ) : (
        <BarVisualizer
          trackRef={localMicTrack}
          className="h-full w-full flex flex-row !gap-1 px-2"
          barCount={6}
          options={{ minHeight: 10, maxHeight: 100 }}
        />
      )}
    </div>
  );
};

export default AudioVisualizerComponent;
