import { GetApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";

// Define the response type for LiveKit room creation
export interface LiveKitRoomResponse {
  token: string;
  room: {
    name: string;
    sid: string;
  };
}

const URL = "/api/v1/livekit/create-room";

export async function GetLiveKitRoom({
  axios,
  onSuccess,
  onError,
}: Omit<GetApiInput<LiveKitRoomResponse>, "url">) {
  GetApi<LiveKitRoomResponse>({
    url: URL,
    axios,
    onSuccess,
    onError,
  });
}