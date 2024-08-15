import { AxiosInstance, AxiosResponse } from "axios";

export default async (axios: AxiosInstance): Promise<AxiosResponse> => {
  return await axios.get("/api/v1/user/logout");
};
