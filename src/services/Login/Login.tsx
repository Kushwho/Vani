import ApiResponse from "@/types/ApiResponse";
import UserDetails from "@/types/UserDetails";
import { AxiosInstance, AxiosResponse } from "axios";

const URL = "/api/v1/user/login";

export interface LoginDataProps {
  phone: string;
  password: string;
}

export type LoginResponse = ApiResponse<Omit<UserDetails, "password">>;

export default  async (
  data: LoginDataProps,
  axios: AxiosInstance
): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> =
    await axios.post<LoginResponse>(URL, data);
 
  
  return response.data;
};
