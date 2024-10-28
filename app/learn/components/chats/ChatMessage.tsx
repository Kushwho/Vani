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
        hideName ? "pt-0" : "pt-6"
      )}
    >
      {!hideName && (
        <div
          className={cn(
            "text-xs  font-medium tracking-wide",
            isSelf
              ? "text-primary/90 dark:text-primary/80"
              : "text-muted-foreground/90 dark:text-muted-foreground/80"
          )}
        >
          {name}
        </div>
      )}
      <div
        className={cn(
          "pr-4 text-sm whitespace-pre-line leading-relaxed",
          isSelf
            ? "text-primary/80 dark:text-primary/70"
            : "text-muted-foreground/80 dark:text-muted-foreground/70"
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
