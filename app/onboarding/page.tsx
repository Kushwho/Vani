"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { OnboardingStep } from "@/types/onboarding";
import { OnboardingSteps } from "./components/steps";
import { OnboardingFormSchema } from "./components/formschema";
import { PostOnboarding } from "@/lib/apis/onboarding/Onboarding";

const OnboardingForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const axios = useAxiosContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof OnboardingFormSchema>>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      nativeLanguage: "",
      languageLevel: "",
      goal: "",
      purpose: "",
      timeToBeDedicated: "",
      learningPace: "",
      challengingAspec: "",
      preferredPracticingWay: "",
      additionalText: "",
      otherLanguage: "",
    },
  });

  const progress = ((currentStep + 1) / OnboardingSteps.length) * 100;

  const handleNext = async () => {
    const currentKey = OnboardingSteps[currentStep].key;
    const isValid = await form.trigger(
      currentKey as keyof z.infer<typeof OnboardingFormSchema>
    );

    if (!isValid) return;

    if (currentStep === OnboardingSteps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, OnboardingSteps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {

      setIsSubmitting(true);
      const values = form.getValues();

      const formData = { ...values };
      if (values.nativeLanguage === "Other (please specify)") {
        formData.nativeLanguage = values.otherLanguage || "";
      }


      PostOnboarding({
        axios,
        data: formData,
        onSuccess: () => {
          toast({
            title: "Success",
            description:
              "Thanks for submitting. Navigating you to the learning page",
          });
          setTimeout(() => {
            router.push("/learn");
          }, 1500);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unknown error occurred.",
          });
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
      });
 
  };

  const renderStepContent = (step: OnboardingStep) => {
    if (step.inputType === "radio") {
      return (
        <FormField
          control={form.control}
          name={step.key as keyof z.infer<typeof OnboardingFormSchema>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {step.options.map((option) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-3"
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
              {field.value === "Other (please specify)" && (
                <Input
                  placeholder="Please specify your language"
                  className="mt-2"
                  {...form.register("otherLanguage")}
                />
              )}
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        control={form.control}
        name={step.key as keyof z.infer<typeof OnboardingFormSchema>}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Enter your response..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black/50 flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader className="space-y-3 sm:space-y-4">
          <CardTitle className="text-lg sm:text-xl">
            Step {currentStep + 1} of {OnboardingSteps.length}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            {OnboardingSteps[currentStep].question}
          </CardDescription>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {renderStepContent(OnboardingSteps[currentStep])}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
            size="sm"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              size="sm"
            >
              Skip
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : currentStep === OnboardingSteps.length - 1 ? (
                "Submit"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingForm;
