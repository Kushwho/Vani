import ApiResponse from "@/types/ApiResponse";
import UserDetails from "@/types/UserDetails";
import { AxiosInstance } from "axios";

const URL = "/api/v1/user/register";

export type SendOtpProps = Omit<
  UserDetails,
  "_id" | "isVerified" | "voice" | "email"
>;

export interface SendOtpResponse {
  userDetails: Omit<UserDetails, "password" | "email">;
  orderId: string;
}

export default async (
  data: SendOtpProps,
  axios: AxiosInstance
): Promise<ApiResponse<SendOtpResponse>> => {
  data = { ...data, phone: data.phone };
  console.log(data);

  const response = await axios.post<ApiResponse<SendOtpResponse>>(URL, data);
  return response.data;
};
