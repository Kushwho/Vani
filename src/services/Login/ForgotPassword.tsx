import ApiResponse from "@/types/ApiResponse";
import { AxiosInstance } from "axios";

interface SendForgotPasswordOTPProps {
  phone: string;
  axios: AxiosInstance;
}

interface SendPasswordWithOtpProps {
  phone: string;
  orderId: string;
  OTP: string;
  newPassword: string;
  axios: AxiosInstance;
}

export const SendOTPForgotPassword = async ({
  phone,
  axios,
}: SendForgotPasswordOTPProps) => {
  const response = await axios.post<
    ApiResponse<{
      orderId: string;
    }>
  >("/api/v1/user/forgot-password", {
    sendOTP: true,
    phone: phone,
    orderId: "",
    OTP: "",
    newPassword: "",
  });

  return response.data;
};

export const SendPasswordWithOtp = async ({
  phone,
  orderId,
  OTP,
  newPassword,
  axios,
}: SendPasswordWithOtpProps) => {
  const response = await axios.post<
    ApiResponse<{
      message: string;
    }>
  >("/api/v1/user/forgot-password", {
    sendOTP: false,
    phone: phone,
    orderId: orderId,
    OTP: OTP,
    newPassword: newPassword,
  });

  return response.data;
};
