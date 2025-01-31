import { GetApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";

// Define the response type for LiveKit room creation


const URL = "/api/v1/livekit/delete-room";

export async function GetLiveKitRoom({
  axios,
  onSuccess,
  onError,
}: Omit<GetApiInput<void>, "url">) {
  GetApi<void>({
    url: URL,
    axios,
    onSuccess,
    onError,
  });
}
