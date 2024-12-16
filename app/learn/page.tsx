"use client";
import React, { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { GetLiveKitRoom } from "@/lib/apis/learn/create-room";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { toast } from "@/hooks/use-toast";
import Room from "./components/room";
import { defaultConfig, LivekitProvider } from "@/context/LivekitContext";

const Page: React.FC = () => {
  const axios = useAxiosContext();
  const [livekitConfig, setLivekitConfig] = useState(defaultConfig);

  useEffect(() => {
    GetLiveKitRoom({
      axios,
      onSuccess: (response) => {

        setLivekitConfig((prevValues) => {
          console.log(response.data.token);
          
          return {
            ...prevValues,
            token: response.data.token,
            isConnected: true,
          };
        });
      },
      onError: (error) => {
        console.log(error);

        toast({ title: "Error", description: error.message });
      },
    });
  }, [ axios]);


  return (
    <>
      <LivekitProvider
        value={{ config: livekitConfig, setConfig: setLivekitConfig }}
      >
        <LiveKitRoom
          video={false}
          audio={true}
          token={livekitConfig.token}
          serverUrl={livekitConfig.serverUrl}
          style={{ height: "100vh" }}
          onError={(error) => {
              console.log(error);
              
          }}
        >
          <Room />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
        </LiveKitRoom>
      </LivekitProvider>
    </>
  );
};

export default Page;
