import { AxiosInstance, AxiosResponse } from "axios";

export default async (axios: AxiosInstance): Promise<AxiosResponse> => {
  return await axios.post("/api/v1/user/logout");
};
