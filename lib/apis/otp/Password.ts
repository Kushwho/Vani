import { PostApiInput } from "@/types/api";
import { PostApi } from "../PostApi";

// Types for sending OTP
interface SendOTPRequest {
    sendOTP: true;
    phone: string;
    orderId: string;
    OTP: string;
    newPassword: string;
  }
  
  interface SendOTPResponse {
    orderId: string;
  }
  
  // Types for resetting password
  interface ResetPasswordRequest {
    sendOTP: false;
    phone: string;
    orderId: string;
    OTP: string;
    newPassword: string;
  }
  
  interface ResetPasswordResponse {
    message: string;
  }
  
  const URL = "/api/v1/user/forgot-password";
  
  // Send OTP API
  export async function PostSendOTP({
    axios,
    data: { phone },
    onSuccess,
    onError,
  }: Omit<PostApiInput<SendOTPResponse, { phone: string }>, "url">) {
    await PostApi<SendOTPResponse, SendOTPRequest>({
      url: URL,
      axios,
      data: {
        sendOTP: true,
        phone,
        orderId: "",
        OTP: "",
        newPassword: "",
      },
      onSuccess,
      onError,
    });
  }
  
  // Reset Password API
  export async function PostResetPassword({
    axios,
    data: { phone, orderId, OTP, newPassword },
    onSuccess,
    onError,
  }: Omit<
    PostApiInput<
      ResetPasswordResponse,
      { phone: string; orderId: string; OTP: string; newPassword: string }
    >,
    "url"
  >) {
    await PostApi<ResetPasswordResponse, ResetPasswordRequest>({
      url: URL,
      axios,
      data: {
        sendOTP: false,
        phone,
        orderId,
        OTP,
        newPassword,
      },
      onSuccess,
      onError,
    });
  }