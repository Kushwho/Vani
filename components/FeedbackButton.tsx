import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { MessageSquare } from "lucide-react";

interface FeedbackButtonProps {
  feedback: {
    sections: {
      title: string;
      content: string;
      type: "positive" | "negative" | "neutral";
    }[];
    recommendations?: string[];
  };
}

export function FeedbackButton({ feedback }: FeedbackButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          View Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Feedback Analysis</DialogTitle>
        </DialogHeader>
        <FeedbackDisplay feedback={feedback} />
      </DialogContent>
    </Dialog>
  );
} 