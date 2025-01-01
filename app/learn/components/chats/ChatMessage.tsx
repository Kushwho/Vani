import React from "react";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};
const ChatMessage = ({
  message,
  name,
  isSelf = false,
  hideName = false,
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 transition-spacing duration-200",
        hideName ? "pt-0" : "pt-6",
        isSelf ? "self-end" : ""
      )}
    >
      {/* Display sender name unless hideName is true */}
      {!hideName && name && (
        <div
          className={cn(
            "text-lg font-medium tracking-wide",
            isSelf
              ? "text-muted-foreground/90 dark:text-muted-foreground/80 self-end"
              : "text-primary/90 dark:text-primary/80"
          )}
        >
          {name}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "pr-4 text-sm whitespace-pre-line leading-relaxed px-3 py-2   w-fit",
          isSelf
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
          hideName ? "rounded-t-none" : "rounded-t-lg",
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
