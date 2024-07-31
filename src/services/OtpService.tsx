// src/services/otpService.ts

import axios, { AxiosInstance } from "axios";

export interface sendOtp {
  username: string;
  password: string;
  phone: string;
}

export interface sendOtpResponse {
  orderId: string;
}

export interface verifyOtp {
  OTP: string;
  phone: string;
  orderId: string;
}

export interface resendOtpRequest {
  orderId: string;
}

export const sendOtpRequest = async (
  data: sendOtp,
  axios: AxiosInstance
): Promise<sendOtpResponse> => {
  const response = await axios.post<sendOtpResponse>("/api/v1/user/", data);
  return response.data;
};

export const verifyOtpRequest = async (
  data: verifyOtp,
  axios: AxiosInstance
): Promise<void> => {
  await axios.post("/api/v1/user/verify", data);
};

export const resendOtpRequest = async (
  orderId: string,
  axios: AxiosInstance
): Promise<resendOtpRequest> => {
  const response = await axios.post<resendOtpRequest>(
    "/api/v1/user/resend-otp",
    { orderId }
  );
  return response.data;
};


