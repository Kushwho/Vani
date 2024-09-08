import { useAxiosContext } from "@/Hooks/useAxiosContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
      "English",
      "Other (please specify)",
    ],
    inputType: "radio",
    key: "nativeLanguage",
  },
  {
    question: "How would you rate your current English speaking ability?",
    options: ["Beginner", "Intermediate", "Advanced", "Near-native"],
    inputType: "radio",
    key: "languageLevel",
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
    key: "goal",
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
    key: "purpose",
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
    key: "timeToBeDedicated",
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
    key: "challengingAspec",
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
    key: "preferredPracticingWay",
  },
  {
    question: "Something you want the AI to know about you?",
    options: [],
    inputType: "text",
    key: "additionalText",
  },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [otherInput, setOtherInput] = useState(""); // Separate state for 'Other' input
  const axios = useAxiosContext();

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    if (currentStep === steps.length - 1) {
      if (formData["nativeLanguage"] === "Other (please specify)") {
        setFormData({ ...formData, nativeLanguage: otherInput });
      }
      axios
        .post("/post-onboarding", formData)
        .then((response) => {
          console.log(response);

          toast("Thanks for submitting. Navigating you to home page");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
          
          toast("An unknow error Occured. ");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const navigate = useNavigate();

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleOtherInputChange = (value: string) => {
    setOtherInput(value);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Close modal when clicking outside the content
    }
  };

  const renderOptions = (step: Step) => {
    if (step.inputType === "radio") {
      return (
        <>
          {step.options.map((option: string) => {
            return (
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
                {formData[step.key] === "Other (please specify)" &&
                  option === "Other (please specify)" && (
                    <input
                      type="text"
                      value={otherInput}
                      placeholder="Please enter your language"
                      onChange={(e) => handleOtherInputChange(e.target.value)}
                      className="ml-2"
                    />
                  )}
              </label>
            );
          })}
        </>
      );
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
    <div
      className="flex flex-col items-center justify-center w-screen h-screen bg-black bg-opacity-50 z-40 gap-4"
      onClick={handleBackgroundClick}
    >
      <div className="max-w-xl bg-white mx-auto h-fit  p-8 border rounded shadow z-50 relative w-4/5">
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
              formData[steps[currentStep].key] == undefined
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={
         
              formData[steps[currentStep].key] == undefined
            }
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-centerpx-4 px-4 py-2 bg-primary-500 text-white rounded"
        onClick={() => {
          navigate("/");
        }}
      >
        Skip
      </div>
    </div>
  );
};

export default Onboarding;
