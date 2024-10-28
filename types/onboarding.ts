

export interface OnboardingStep {
  question: string;
  options: string[];
  inputType: "radio" | "text";
  key: string;
}

