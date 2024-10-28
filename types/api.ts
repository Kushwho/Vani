import { AxiosInstance } from "axios";

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

type ApiError = {
  statusCode: number;
  message: string;
  errors: string[];
  success: boolean;
};

type GetApiInput<T> = {
  axios: AxiosInstance;
  url: string;
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (err: ApiError) => void;
};

type PostApiInput<T, D> = {
  url: string;
  axios: AxiosInstance;
  data: D;
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
};
export type { ApiResponse, ApiError, GetApiInput, PostApiInput };
