export interface SessionFeedback {
  type: "positive" | "negative" | "neutral";
  title: string;
  content: string;
  timestamp: string;
}

export interface SessionChatMessage {
  message: string;
  sender: string;
  timestamp: string;
}

export interface UserSession {
  _id: string;
  userId: string;
  roomName?: string;
  sessionType: 'learning' | 'class';
  // Class session metadata (only for class sessions)
  standard?: number;
  subject?: string;
  chapter?: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'cancelled';
  chatHistory?: SessionChatMessage[];
  feedback?: SessionFeedback[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionFeedbackRequest {
  type: "positive" | "negative" | "neutral";
  title: string;
  content: string;
}

export interface JoinSessionResponse {
  token: string;
  room: {
    name: string;
    sid: string;
  };
  session: UserSession;
}
