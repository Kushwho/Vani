import { PostApiInput } from "@/types/api";
import UserDetails from "@/types/user-details";
import { PostApi } from "../PostApi";

export interface VerifyPhoneOtpRequest {
  OTP: string;
  phone: string;
  orderId: string;
}

export interface VerifyPhoneOtpResponse {
  isOTPVerified: boolean;
  userDetails: Omit<UserDetails, "password">;
}

const URL = "/api/v1/user/verify";

export async function PostVerifyOtp({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<VerifyPhoneOtpResponse, VerifyPhoneOtpRequest>, "url">) {
  const requestData = { ...data, phone: data.phone };

  await PostApi<VerifyPhoneOtpResponse, VerifyPhoneOtpRequest>({
    url: URL,
    axios,
    data: requestData,
    onSuccess,
    onError,
  });
}
