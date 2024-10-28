import { OnboardingStep } from "@/types/onboarding";

export const OnboardingSteps: OnboardingStep[] = [
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
    // Add your other steps here without comments inside the array
    {
      question: "What's your language learning goal?",
      options: [
        "Fluency",
        "Basic Conversation",
        "Professional Use",
        "Academic Research",
      ],
      inputType: "radio",
      key: "goal",
    },
    {
      question: "What's your current language level?",
      options: ["Beginner", "Intermediate", "Advanced", "Fluent"],
      inputType: "radio",
      key: "languageLevel",
    },
    {
      question: "What is your main purpose for learning?",
      options: ["Travel", "Work", "Education", "Personal Interest"],
      inputType: "radio",
      key: "purpose",
    },
    {
      question: "How much time can you dedicate each week?",
      options: ["<1 hour", "1-3 hours", "3-5 hours", "5+ hours"],
      inputType: "radio",
      key: "timeToBeDedicated",
    },
    {
      question: "What's your preferred learning pace?",
      options: ["Slow", "Moderate", "Fast", "Intensive"],
      inputType: "radio",
      key: "learningPace",
    },
    {
      question: "What do you find most challenging?",
      options: ["Speaking", "Listening", "Reading", "Writing"],
      inputType: "radio",
      key: "challengingAspec",
    },
    {
      question: "How do you prefer to practice?",
      options: ["Solo", "With a Tutor", "In a Group", "Online Courses"],
      inputType: "radio",
      key: "preferredPracticingWay",
    },
    {
      question: "Any additional information you'd like to share?",
      options: [],
      inputType: "text",
      key: "additionalText",
    },
  ];