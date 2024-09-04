import { useState } from "react";

// Define types for step data
interface Step {
  question: string;
  options: string[];
  inputType: "radio" | "text";
  key: string;
}

const steps: Step[] = [
  {
    question: "What's your native language?",
    options: [
      "Hindi",
      "Spanish",
      "Mandarin",
      "Arabic",
      "Other (please specify)",
    ],
    inputType: "radio",
    key: "nativeLanguage",
  },
  {
    question: "How would you rate your current English speaking ability?",
    options: ["Beginner", "Intermediate", "Advanced", "Near-native"],
    inputType: "radio",
    key: "englishAbility",
  },
  {
    question: "What's your primary goal for using this app?",
    options: [
      "Improve pronunciation",
      "Enhance fluency",
      "Build vocabulary",
      "Practice conversation skills",
    ],
    inputType: "radio",
    key: "primaryGoal",
  },
  {
    question: "In which setting do you most often use English?",
    options: [
      "Work/Professional",
      "Academic",
      "Social interactions",
      "Travel",
      "I rarely use English currently",
    ],
    inputType: "radio",
    key: "englishUsage",
  },
  {
    question: "How much time can you dedicate to language learning daily?",
    options: [
      "5-15 minutes",
      "15-30 minutes",
      "30-60 minutes",
      "More than 60 minutes",
    ],
    inputType: "radio",
    key: "learningTime",
  },
  {
    question: "What's your preferred learning pace?",
    options: [
      "Slow and thorough",
      "Moderate",
      "Fast-paced",
      "Adaptive (varies by topic)",
    ],
    inputType: "radio",
    key: "learningPace",
  },
  {
    question: "Which aspect of spoken English do you find most challenging?",
    options: [
      "Pronunciation",
      "Fluency",
      "Understanding different accents",
      "Using appropriate tone and intonation",
    ],
    inputType: "radio",
    key: "challenge",
  },
  {
    question: "How do you prefer to practice speaking?",
    options: [
      "Repeating phrases and sentences",
      "Engaging in free conversation",
      "Role-playing specific scenarios",
      "A mix of structured and free-form practice",
    ],
    inputType: "radio",
    key: "practicePreference",
  },
  {
    question: "Something you want the AI to know about you?",
    options: [],
    inputType: "text",
    key: "additionalInfo",
  },
];

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal(); // Close modal when clicking outside the content
    }
  };

  const renderOptions = (step: Step) => {
    if (step.inputType === "radio") {
      return step.options.map((option: string) => (
        <label key={option} className="block my-2">
          <input
            type="radio"
            name={step.key}
            value={option}
            checked={formData[step.key] === option}
            onChange={(e) => handleChange(step.key, e.target.value)}
            className="mr-2"
          />
          {option}
        </label>
      ));
    } else if (step.inputType === "text") {
      return (
        <textarea
          placeholder="Enter text here..."
          className="w-full p-2 border rounded"
          value={formData[step.key] || ""}
          onChange={(e) => handleChange(step.key, e.target.value)}
        />
      );
    }
  };

  return (
    isOpen && (
      <div
        className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleBackgroundClick}
      >
        <div className="max-w-xl bg-white mx-auto h-fit my-auto p-8 border rounded shadow z-50 relative w-4/5">
          <h2 className="text-lg font-bold mb-4">
            Step {currentStep + 1} of {steps.length}
          </h2>
          <p className="mb-4">{steps[currentStep].question}</p>
          <div>{renderOptions(steps[currentStep])}</div>

          <div className="flex justify-between mt-5">
            <button
              onClick={handlePrevious}
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className={`px-4 py-2 bg-primary-500 text-white rounded ${
                currentStep === steps.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default StepForm;