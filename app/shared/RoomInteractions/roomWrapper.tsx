"use client";
import { defaultConfig, LivekitProvider } from "@/context/LivekitContext";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { GetLiveKitRoom } from "@/lib/apis/learn/create-room";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import React, { useEffect, useState } from "react";
import Room from "./room";
import { toast } from "@/hooks/use-toast";
import useAuthContext from "@/hooks/custom/useAuthContext";
import { DeleteLiveKitRoom } from "@/lib/apis/learn/delete-room";
import { CreateDemoLiveKitRoom } from "@/lib/apis/learn/create-demo-room";

type roomWrapperProps = {
  showChat: boolean;
};

const RoomWrapper: React.FC<roomWrapperProps> = ({ showChat }) => {
  const axios = useAxiosContext();
  const auth = useAuthContext();
  const [livekitConfig, setLivekitConfig] = useState(defaultConfig);

  useEffect(() => {
    if (auth.config.loggedIn) {
      GetLiveKitRoom({
        axios,
        onSuccess: (response) => {
          setLivekitConfig((prevValues) => {
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
    } else {
      CreateDemoLiveKitRoom({
        axios,
        onSuccess: (response) => {
          setLivekitConfig((prevValues) => {
            return {
              ...prevValues,
              token: response.data.token,
              isConnected: true,
            };
          });
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }

    return () => {
      DeleteLiveKitRoom({
        axios,
        onSuccess: () => {
          setLivekitConfig((prevValues) => {
            return {
              ...prevValues,  
              token: "",
              isConnected: false,
            };
          });
        },
        onError: (error) => {
          console.log(error);
        },
      });
    };
  }, [axios, auth.config]);

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
          style={{ height: "fit-content" }}
          onError={(error) => {
            console.log(error);
          }}
        >
          <Room showChat={showChat} />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
        </LiveKitRoom>
      </LivekitProvider>
    </>
  );
};

export default RoomWrapper;
