import React from "react";
import {
  BarVisualizer,
  AudioTrack,
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
    return <></>;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="h-32 w-32  rounded-lg overflow-hidden">
        <AudioTrack trackRef={localMicTrack}>
          <BarVisualizer
            height={128}
            className="w-full"
            options={{
              minHeight: 2,
              maxHeight: 90,
            }}
            barCount={24}
            trackRef={localMicTrack}
          />
        </AudioTrack>
      </div>
    </div>
  );
};

export default AudioVisualizerComponent;
