import { FeedbackButton } from "@/components/FeedbackButton";

export default function FeedbackPage() {
  // Sample feedback data structured according to the new format
  const sampleFeedback = {
    sections: [
      {
        title: "Communication Strengths",
        content: "Shows politeness by inquiring about the assistant's well-being.",
        type: "positive" as const
      },
      {
        title: "Areas for Improvement",
        content: "Grammatical correctness and clarity. \"How you?\" is not standard English.",
        type: "negative" as const
      }
    ],
    recommendations: [
      "Instead of \"Hello, how you?\", use \"Hello, how are you?\" to ensure clarity and proper grammar."
    ]
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Feedback Analysis</h1>
        <div className="w-full sm:w-auto">
          <FeedbackButton feedback={sampleFeedback} />
        </div>
      </div>
    </div>
  );
} 