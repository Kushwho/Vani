import { z } from "zod";

export const OnboardingFormSchema = z.object({
    nativeLanguage: z.string().min(1, "Please select a language"),
    languageLevel: z.string().min(1, "Please select your level"),
    goal: z.string().min(1, "Please select a goal"),
    purpose: z.string().min(1, "Please select a purpose"),
    timeToBeDedicated: z.string().min(1, "Please select time"),
    learningPace: z.string().min(1, "Please select pace"),
    challengingAspec: z.string().min(1, "Please select challenge"),
    preferredPracticingWay: z.string().min(1, "Please select preference"),
    additionalText: z.string().optional(),
    otherLanguage: z.string().optional(),
  });
  