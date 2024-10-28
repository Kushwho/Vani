import { ApiError, ApiResponse, PostApiInput } from "@/types/api";

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
      onError(error as ApiError);
    }
  }
}
