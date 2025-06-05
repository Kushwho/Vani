import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessageInput = {
  placeholder: string;
  height: number;
  onSend?: (_message: string) => void;
};

const ChatMessageInput = ({
  placeholder,
  height,
  onSend,
}: ChatMessageInput) => {
  const [message, setMessage] = useState("");
  const [inputTextWidth, setInputTextWidth] = useState(0);
  const hiddenInputRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputHasFocus, setInputHasFocus] = useState(false);

  const handleSend = useCallback(() => {
    if (!onSend) {
      return;
    }
    if (message === "") {
      return;
    }

    onSend(message);
    setMessage("");
  }, [onSend, message]);

  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [message]);

  useEffect(() => {
    if (hiddenInputRef.current) {
      setInputTextWidth(hiddenInputRef.current.clientWidth);
    }
  }, [hiddenInputRef, message]);

  return (
    <div
      className="flex flex-col gap-2 border-t border-border/40 w-full"
      style={{ height }}
    >
      <div className="flex flex-row pt-3 gap-2 items-center relative">
        <div
          className={cn(
            "w-2 h-4 absolute left-2 transition-all duration-200",
            inputHasFocus ? "bg-primary shadow-sm" : "bg-muted",
            !isTyping && inputHasFocus && "animate-pulse"
          )}
          style={{
            transform: `translateX(${
              message.length > 0
                ? Math.min(
                    inputTextWidth,
                    (inputRef.current?.offsetWidth || 0) - 20
                  ) - 4
                : 0
            }px)`,
          }}
        />

        <Input
          ref={inputRef}
          className={cn(
            "w-full text-xs caret-transparent bg-transparent",
            "text-foreground/25 focus:text-foreground transition-colors duration-200",
            "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0",
            "hover:text-foreground/40"
          )}
          style={{
            paddingLeft: message.length > 0 ? "12px" : "24px",
            caretShape: "block",
          }}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setInputHasFocus(true)}
          onBlur={() => setInputHasFocus(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <span
          ref={hiddenInputRef}
          className="absolute top-0 left-0 text-xs pl-3 text-primary pointer-events-none opacity-0"
        >
          {message.replaceAll(" ", "\u00a0")}
        </span>

        <Button
          variant="ghost"
          size="sm"
          disabled={message.length === 0 || !onSend}
          onClick={handleSend}
          className={cn(
            "text-xs uppercase font-medium transition-all duration-200",
            message.length === 0
              ? "opacity-25 pointer-events-none"
              : "hover:bg-primary/10"
          )}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export { ChatMessageInput };
