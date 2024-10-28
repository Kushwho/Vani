import { PostApiInput } from "@/types/api";
import { PostApi } from "../PostApi";

export interface ResendOtpRequest {
  orderId: string;
}

export interface ResendOtpResponse {
  orderId: string;
}

const URL = "/api/v1/user/resend-otp";

export async function PostResendOtp({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<ResendOtpResponse, ResendOtpRequest>, "url">) {
  await PostApi<ResendOtpResponse, ResendOtpRequest>({
    url: URL,
    axios,
    data,
    onSuccess,
    onError,
  });
}
