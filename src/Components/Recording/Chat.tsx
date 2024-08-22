// ChatHistory.tsx
import React from "react";

export interface Message {
  id: string;
  sender: "me" | "other";
  content: string;
}

export interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <section className=" py-16 h-fit bg-primary-50">
      <h2 className="text-xl font-bold text-center w-full">Chat History</h2>
      <div className="flex flex-col p-4  rounded-lg  w-full max-w-6xl mx-auto h-[500px] h-full">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet</div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.sender === "me"
                    ? "bg-primary-600 text-white self-end max-w-[75%]"
                    : "bg-white border border-gray-300 self-start text-primary-800 max-w-[75%]"
                }`}
              >
                <div>{msg.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatHistory;
