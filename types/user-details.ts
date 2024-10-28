import { VOICE_OPTIONS } from "@/types/voice-options";

interface UserDetails {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  isVerified: boolean;
  password: string;
  voice: VOICE_OPTIONS;
}

export default UserDetails;
