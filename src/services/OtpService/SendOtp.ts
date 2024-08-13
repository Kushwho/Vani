import { AxiosInstance } from "axios";

const URL = "/api/v1/user";

export interface SendOtpProps {
  email: string;
  phone: string;
  password: string;
}

export interface SendOtpResponse {
  orderId: string;
}

export default async (
  data: SendOtpProps,
  axios: AxiosInstance
): Promise<SendOtpResponse> => {
  const response = await axios.post<SendOtpResponse>(URL, data);
  return response.data;
};
