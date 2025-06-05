import { GetApiInput, PostApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";
import { PostApi } from "../PostApi";
import { UserSession, SessionFeedbackRequest, JoinSessionResponse } from "@/types/sessions";

// Get user sessions
export async function GetUserSessions({
  axios,
  userId,
  onSuccess,
  onError,
}: Omit<GetApiInput<UserSession[]>, "url"> & { userId: string }) {
  GetApi<UserSession[]>({
    url: `/api/v1/sessions/user/${userId}`,
    axios,
    onSuccess,
    onError,
  });
}

// Join existing session by room name
export async function PostJoinSessionByRoomName({
  axios,
  roomName,
  onSuccess,
  onError,
}: Omit<PostApiInput<JoinSessionResponse, { roomName: string }>, "url"> & { roomName: string }) {
  PostApi<JoinSessionResponse, { roomName: string }>({
    url: "/api/v1/livekit/join-room",
    axios,
    data: { roomName },
    onSuccess,
    onError,
  });
}

// Add feedback to session
export async function PostSessionFeedback({
  axios,
  sessionId,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<UserSession, SessionFeedbackRequest>, "url"> & { sessionId: string }) {
  PostApi<UserSession, SessionFeedbackRequest>({
    url: `/api/v1/sessions/${sessionId}/feedback`,
    axios,
    data,
    onSuccess,
    onError,
  });
}

// Get session by ID
export async function GetSessionById({
  axios,
  sessionId,
  onSuccess,
  onError,
}: Omit<GetApiInput<UserSession>, "url"> & { sessionId: string }) {
  GetApi<UserSession>({
    url: `/api/v1/sessions/${sessionId}`,
    axios,
    onSuccess,
    onError,
  });
}

// End session
export async function PostEndSessionById({
  axios,
  sessionId,
  onSuccess,
  onError,
}: Omit<PostApiInput<UserSession, Record<string, never>>, "url"> & { sessionId: string }) {
  PostApi<UserSession, Record<string, never>>({
    url: `/api/v1/sessions/${sessionId}/end`,
    axios,
    data: {},
    onSuccess,
    onError,
  });
}

// Generate feedback for session
export interface GenerateFeedbackRequest {
  sessionId: string;
}

export interface GeneratedFeedback {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  content: string;
}

export interface GenerateFeedbackResponse {
  feedback: GeneratedFeedback;
}

export async function PostGenerateFeedback({
  axios,
  data,
  onSuccess,
  onError,
}: Omit<PostApiInput<GenerateFeedbackResponse, GenerateFeedbackRequest>, "url">) {
  PostApi<GenerateFeedbackResponse, GenerateFeedbackRequest>({
    url: "/api/v1/feedback/generate",
    axios,
    data,
    onSuccess,
    onError,
  });
}
