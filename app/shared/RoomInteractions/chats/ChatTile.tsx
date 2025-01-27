import ChatMessage from "@/app/shared/RoomInteractions/chats/ChatMessage";
import { ChatMessageInput } from "@/app/shared/RoomInteractions/chats/ChatMessageInput";
import { cn } from "@/lib/utils";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";

const inputHeight = 48;

export type ChatMessageType = {
  name: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
};

type ChatTileProps = {
  messages: ChatMessageType[];

  onSend?: (_: string) => Promise<ComponentsChatMessage>;
};

export const ChatTile = ({ messages, onSend }: ChatTileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef, messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <ScrollArea
        ref={containerRef}
        className={cn(
          "flex-1 px-4 pb-4",
          "transition-all duration-200 ease-in-out overflow-scroll h-full"
        )}
      >
        <div className="flex flex-col  justify-end">
          {messages.map((message, index, allMsg) => {
            const hideName =
              index >= 1 && allMsg[index - 1]?.name === message?.name;

            return (
              <ChatMessage
                key={index}
                hideName={hideName}
                name={message?.name}
                message={message.message}
                isSelf={message.isSelf}
              />
            );
          })}
        </div>
      </ScrollArea>

      <div className="py-2 pl-2">
        <ChatMessageInput
          height={inputHeight}
          placeholder="Type a message"
          onSend={onSend}
        />
      </div>
    </div>
  );
};
