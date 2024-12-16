import React from "react";
import {
  BarVisualizer,
  AudioTrack,
  useTracks,
} from "@livekit/components-react";
import { LocalParticipant, Track } from "livekit-client";

export const AudioVisualizerComponent = () => {
  const tracks = useTracks();
  const localParticipant = tracks.filter((track) => {
    return track.participant instanceof LocalParticipant;
  });

  const localMicTrack = localParticipant.find((track) => {
    return track.source === Track.Source.Microphone;
  });

  if (!localMicTrack) {
    return <></>;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="h-32 bg-gray-900 rounded-lg overflow-hidden">
        <AudioTrack trackRef={localMicTrack}>
          <BarVisualizer
            height={128}
            className="w-full"
            options={{
              minHeight: 2,
              maxHeight: 90,
            }}
            barCount={24}
          />
        </AudioTrack>
      </div>
    </div>
  );
};

export default AudioVisualizerComponent;
