import useAxiosContext from "@/hooks/custom/useAxiosContext";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  EndSessionRequest,
  PostEndSession,
} from "@/lib/apis/learn/end-session";

interface FeedbackModalProps {
  isOpen: boolean;
  cleanupFunction: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  cleanupFunction,
}) => {
  const [feedback, setFeedback] = useState<EndSessionRequest>({
    overallExperience: 5,
    responseQuality: 5,
    conversationQuality: 5,
    aiUnderstanding: 5,
  });

  const axios = useAxiosContext();
  const router = useRouter();

  const handleChange = (field: keyof EndSessionRequest, value: number) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const toFed = {
      overallExperience: feedback.overallExperience,
      aiUnderstanding: feedback.aiUnderstanding,
      responseQuality: feedback.responseQuality,
      conversationQuality: feedback.conversationQuality,
    };

    PostEndSession({
      axios,
      data: toFed,
      onSuccess: () => {
        cleanupFunction();
        toast({
          title: "Thank you!",
          description: "Thanks for using. Navigating to the home page.",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      },
      onError: (e) => {
        console.log(e);
        
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "An unknown error occurred. Navigating to the home page.",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={cleanupFunction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Your Feedback</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {[
            "overallExperience",
            "responseQuality",
            "conversationQuality",
            "aiUnderstanding",
          ].map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <Slider
              max={10}
                value={[feedback[field as keyof EndSessionRequest]]}
                onValueChange={(value) =>
                  handleChange(field as keyof EndSessionRequest, value[0])
                }
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
