import { PostApiInput } from "@/types/api";
import { PostApi } from "../PostApi";

// Since logout doesn't need request data, we use empty object
type LogoutRequest = Record<string, never>;
// Since logout doesn't return data, we use void
type LogoutResponse = void;

const URL = "/api/v1/user/logout";

export async function Logout({
  axios,
  onSuccess,
  onError,
}: Omit<PostApiInput<LogoutResponse, LogoutRequest>, "url" | "data">) {
  await PostApi<LogoutResponse, LogoutRequest>({
    url: URL,
    axios,
    data: {}, // Empty object for no data
    onSuccess,
    onError,
  });
}
