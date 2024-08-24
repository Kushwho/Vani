import { VOICE_OPTIONS } from "@/util/constant";

interface UserDetails {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  isVerified: boolean;
  password: string;
  voice:VOICE_OPTIONS
}

export default UserDetails;
