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
      className={`flex flex-row w-full gap-2 h-[100px]  overflow-visible items-center  justify-center border rounded-sm border-gray-100 bg-green-600`}
    >
      <BarVisualizer
        trackRef={localMicTrack}
        className="h-full w-full [&>*]:inline-block"
        barCount={10}
        options={{ minHeight: 20 }}
      />
    </div>
  );
};

export default AudioVisualizerComponent;
