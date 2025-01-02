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

  // if (!localMicTrack) {
  //   return <>no track available</>;
  // }

  return (
    <div
      className={`flex flex-row  w-full h-[100px]  items-center  justify-center border rounded-sm border-gray-100 bg-primary`}
    >
      <BarVisualizer
        trackRef={localMicTrack}
        className="h-full w-full flex flex-row !gap-1"
        barCount={10}
        options={{ minHeight: 10, maxHeight: 100 }}
      />
    </div>
  );
};

export default AudioVisualizerComponent;
