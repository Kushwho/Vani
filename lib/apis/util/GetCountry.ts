import { GetApiInput } from "@/types/api";
import { GetApi } from "../GetApi";
import { CountryResponse } from "@/types/country-response";
import axios from "axios";

const URL = "https://api.country.is/";

export async function GetCountry({
  onSuccess,
  onError,
}: Omit<GetApiInput<CountryResponse>, "url"| "axios">) {
  GetApi<CountryResponse>({
    url: URL,
    axios,
    onSuccess,
    onError,
  });
}
