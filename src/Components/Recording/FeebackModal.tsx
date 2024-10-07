import { useAxiosContext } from "@/Hooks/useAxiosContext";
import ApiResponse from "@/types/ApiResponse";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
  cleanupFunction
}) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    overallExperience: 5,
    personalisation: 5,
    responseQuality: 5,
    conversationQuality: 5,
    textFeedback: "",
  });

  const axios = useAxiosContext();
  const navigate = useNavigate();

  const handleChange = (field: keyof FeedbackData, value: number | string) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const toFed = { ...feedback, aiUnderstanding: feedback.textFeedback };

    delete toFed.personalisation;
    const resp = await axios.post<ApiResponse<any>>(
      "https://backend.vanii.ai/auth/api/v1/user/post-review",
      toFed
    );

    if (resp.data.success) {
      cleanupFunction();
      toast("Thanks for using.Navigating to home page.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast("An unknown error occured. Navigating to home page.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Provide Your Feedback</h2>

        {[
          "overallExperience",
          "personalisation",
          "responseQuality",
          "conversationQuality",
        ].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <div className="flex flex-row gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={feedback[field as keyof FeedbackData]}
                onChange={(e) =>
                  handleChange(
                    field as keyof FeedbackData,
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {feedback[field as keyof FeedbackData]}
              </span>
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Feedback
          </label>
          <textarea
            value={feedback.textFeedback}
            onChange={(e) => handleChange("textFeedback", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-40"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
