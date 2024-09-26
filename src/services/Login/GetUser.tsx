import ApiResponse from "@/types/ApiResponse";
import UserDetails from "@/types/UserDetails";
import { AxiosInstance } from "axios";

const URL = "api/v1/user/get-user";
type GetUserProps = void;

type GetUserResponse = ApiResponse<{
  user: UserDetails;
}>;

export default async (
  data: GetUserProps,
  axios: AxiosInstance
): Promise<GetUserResponse> => {
  console.log(data);
  try {
    const resp = await axios.get<GetUserResponse>(URL);
    console.log(resp.data);

    return resp.data;
  } catch (err) {
    throw err;
  }
};
