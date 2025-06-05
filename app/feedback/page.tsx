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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feedback Analysis</h1>
        <FeedbackButton feedback={sampleFeedback} />
      </div>
    </div>
  );
} 