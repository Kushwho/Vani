
import ApiResponse from "@/types/ApiResponse";
import UserDetails from "@/types/UserDetails";
import { AxiosInstance } from "axios";

const URL = "/api/v1/user/verify";

export interface VerifyPhoneOtpRequest {
  OTP: string;
  phone: string;
  orderId: string;
}

export interface VerifyPhoneOtpResponse {
  isOtpVerified: boolean;
  userDetails: Omit<UserDetails, "password">;
}

export default async (
  data: VerifyPhoneOtpRequest,
  axios: AxiosInstance
): Promise<ApiResponse<VerifyPhoneOtpResponse>> => {
  const response = await axios.post<ApiResponse<VerifyPhoneOtpResponse>>(
    URL,
    data
  );
  return response.data;
};
