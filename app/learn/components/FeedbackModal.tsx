import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { ApiResponse } from "@/types/api";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  isOpen: boolean;
  cleanupFunction: () => void;
}

interface FeedbackData {
  overallExperience: number;
  personalisation?: number;
  responseQuality: number;
  conversationQuality: number;
  textFeedback: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  cleanupFunction,
}) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    overallExperience: 5,
    personalisation: 5,
    responseQuality: 5,
    conversationQuality: 5,
    textFeedback: "",
  });

  const axios = useAxiosContext();
  const router = useRouter();

  const handleChange = (field: keyof FeedbackData, value: number | string) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const toFed = { ...feedback, aiUnderstanding: feedback.textFeedback };
      delete toFed.personalisation;

      const resp = await axios.post<ApiResponse<unknown>>(
        "/api/v1/user/post-review",
        toFed
      );

      if (resp.data.success) {
        cleanupFunction();
        toast({
          title: "Thank you!",
          description: "Thanks for using. Navigating to the home page.",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.log(error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unknown error occurred. Navigating to the home page.",
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
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
            "personalisation",
            "responseQuality",
            "conversationQuality",
          ].map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[feedback[field as keyof FeedbackData] as number]}
                  onValueChange={(value) =>
                    handleChange(field as keyof FeedbackData, value[0])
                  }
                  className="w-full"
                />
                <span className="w-12 text-sm text-gray-500 text-right">
                  {feedback[field as keyof FeedbackData]}
                </span>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Additional Feedback
            </label>
            <Textarea
              value={feedback.textFeedback}
              onChange={(e) => handleChange("textFeedback", e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
