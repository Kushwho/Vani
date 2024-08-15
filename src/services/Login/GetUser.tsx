import ApiResponse from "@/types/ApiResponse";
import UserDetails from "@/types/UserDetails";
import { AxiosInstance } from "axios";

const URL = "api/v1/get-user";
type GetUserProps = void;

type GetUserResponse = ApiResponse<Omit<UserDetails, "password">>;

export default async (
  data: GetUserProps,
  axios: AxiosInstance
): Promise<GetUserResponse> => {
  console.log(data);
  
  const resp = await axios.get<GetUserResponse>(URL);
  return resp.data;
};
