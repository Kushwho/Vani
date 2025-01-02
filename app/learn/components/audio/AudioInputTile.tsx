import React from "react";
import {
  BarVisualizer,

  useTracks,
} from "@livekit/components-react";
import { LocalParticipant, Track } from "livekit-client";
import "@livekit/components-styles";


export const AudioVisualizerComponent = () => {
  const tracks = useTracks();

  const localTracks = tracks.filter(({participant})=> participant instanceof LocalParticipant);

  const localMicTrack = localTracks.find((track) => {
    return track.source === Track.Source.Microphone;
  });

  if (!localMicTrack) {
    return <>no track available</>;
  }

  return (
    <div
      className={`flex flex-row gap-2 h-[100px] items-center w-full justify-center border rounded-sm border-gray-800 bg-gray-900`}
    >
      <BarVisualizer
        trackRef={localMicTrack}
        className="h-full w-full"
        barCount={20}
        options={{ minHeight: 0 }}
      />
    </div>
  );
};

export default AudioVisualizerComponent;
