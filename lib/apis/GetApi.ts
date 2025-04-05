import { ApiError, ApiResponse, GetApiInput } from "@/types/api";

export async function GetApi<T>({
  url,
  axios,
  onSuccess,
  onError,
}: GetApiInput<T>) {
  try {
    const response = await axios.get<ApiResponse<T>>(url);
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
        onError(error.response as ApiError);
      } else {
        onError(error as ApiError);
      }
    }
  }
}
