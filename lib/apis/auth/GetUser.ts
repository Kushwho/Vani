import { GetApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";
import UserDetails from "@/types/user-details";
const URL = "api/v1/user/get-user";

export async function GetUser({
  axios,
  onSuccess,
  onError,
}: Omit<GetApiInput<UserDetails>, "url">) {
  GetApi<UserDetails>({
    url: URL,
    axios,
    onSuccess,
    onError,
  });
}
