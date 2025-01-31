import { PostApi } from "../PostApi";
import { PostApiInput } from "@/types/api";
export interface EndSessionRequest {
    overallExperience: number;
    responseQuality: number;
    conversationQuality: number;
    aiUnderstanding:number;
  }
interface EndSessionResponse {
  success: boolean;
  message: string;
}

export async function PostEndSession({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<EndSessionResponse, EndSessionRequest>, "url">) {
  await PostApi<EndSessionResponse, EndSessionRequest>({
    url: "/api/v1/user/post-review",
    axios,
    data,
    onSuccess,
    onError,
  });
}