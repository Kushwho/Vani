import { ApiError, ApiResponse, PostApiInput } from "@/types/api";
import { AxiosError, isAxiosError } from "axios";

export async function PostApi<T, D>({
  url,
  axios,
  data,
  onSuccess,
  onError,
}: PostApiInput<T, D>) {
  try {
    const response = await axios.post<ApiResponse<T>>(url, data);
    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (error: unknown) {
    if (onError) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        onError((error as any).response as ApiError);
      } else {
        onError(error as ApiError);
      }
    }
  }
}
