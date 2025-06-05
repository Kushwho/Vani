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
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        // Axios error with response data
        onError(error.response.data as ApiError);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        // Generic error with message
        onError({
          statusCode: 500,
          message: (error as Error).message,
          errors: [],
          success: false,
        });
      } else {
        // Fallback error
        onError({
          statusCode: 500,
          message: "An unexpected error occurred",
          errors: [],
          success: false,
        });
      }
    }
  }
}
