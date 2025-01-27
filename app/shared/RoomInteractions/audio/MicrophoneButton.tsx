import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MicrophoneButtonProps {
  isRecording: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MicrophoneButton = ({
  isRecording,
  isLoading = false,
  disabled = false,
  onClick,
  className,
}: MicrophoneButtonProps) => {
  const getTooltipText = () => {
    if (disabled) return "Microphone access not available";
    if (isLoading) return "Initializing microphone...";
    if (isRecording) return "Stop recording";
    return "Start recording";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            disabled={disabled || isLoading}
            onClick={onClick}
            className={cn(
              "relative",
              isLoading && "animate-pulse",
              className
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
              <>
                <MicOff className="h-20 w-20" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </>
            ) : (
              <Mic className="h-20 w-20" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Optional: Create a variant with status text
export const MicrophoneButtonWithStatus = ({
  isRecording,
  isLoading = false,
  disabled = false,
  onClick = () => {},
  className,
}: MicrophoneButtonProps) => {
  return (
    <div className="flex items-center gap-3">
      <MicrophoneButton
        isRecording={isRecording}
        isLoading={isLoading}
        disabled={disabled}
        onClick={onClick}
        className={className}
      />
      {(isRecording || isLoading) && (
        <span className="text-sm text-muted-foreground">
          {isLoading ? "Initializing..." : "Recording..."}
        </span>
      )}
    </div>
  );
};

export default MicrophoneButton;
