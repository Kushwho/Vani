import { AxiosInstance, AxiosResponse } from "axios";

const URL = "/api/v1/user/verify";

export interface VerifyPhoneOtpRequest {
  OTP: string;
  phone: string;
  orderId: string;
}

export default async (
  data: VerifyPhoneOtpRequest,
  axios: AxiosInstance
): Promise<void> => {
  await axios.post(URL, data);
};
