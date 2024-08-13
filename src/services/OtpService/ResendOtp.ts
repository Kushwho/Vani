import { AxiosInstance } from "axios";

export interface ResendOtpRequest {
  orderId: string;
}

export interface ResendOtpResponse {
  orderId: string;
}

const URL = "/api/v1/user/resend-otp";

export default async (
  data: ResendOtpRequest,
  axios: AxiosInstance
): Promise<ResendOtpResponse> => {
  const response = await axios.post<ResendOtpRequest>(URL, data);
  return response.data;
};
