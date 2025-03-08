import { GetApiInput, PostApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";
import { PostApi } from "../PostApi";
import { LiveKitMetadata } from "@/types/livekit";

// Define the response type for LiveKit room creation
export interface LiveKitRoomResponse {
  token: string;
  room: {
    name: string;
    sid: string;
  };
}

const URL = "/api/v1/livekit/create-room";
const URL2 = "/api/v1/livekit/create-study-room";

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
export async function GetLiveKitStudyRoom({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<LiveKitRoomResponse,LiveKitMetadata>, "url">) {
  PostApi<LiveKitRoomResponse,LiveKitMetadata>({
    url: URL2,
    axios,
    data,
    onSuccess,
    onError,
  });
}
