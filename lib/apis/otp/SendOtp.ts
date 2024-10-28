import { PostApiInput } from "@/types/api";
import UserDetails from "@/types/user-details";
import { PostApi } from "../PostApi";

// Request type
export type RegisterRequestData = Omit<
  UserDetails,
  "_id" | "isVerified" | "voice" | "email"
>;

// Response type
export interface RegisterResponse {
  userDetails: Omit<UserDetails, "password" | "email">;
  orderId: string;
}

const URL = "/api/v1/user/register";

export async function PostRegister({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<RegisterResponse, RegisterRequestData>, "url">) {
  await PostApi<RegisterResponse, RegisterRequestData>({
    url: URL,
    axios,
    data,
    onSuccess,
    onError,
  });
  // Modify data if needed
}
