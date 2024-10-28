export interface LiveKitRoom {
    name: string;
    sid: string;
  }
  
  export interface LiveKitToken {
    token: string;
    room: LiveKitRoom;
  }
  
  // You can extend the existing API types if needed
  import { ApiResponse } from "@/types/api";
  
  export type LiveKitApiResponse = ApiResponse<LiveKitToken>;