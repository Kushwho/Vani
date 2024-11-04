import { FeatureCategory, Plan } from "@/types/pricing";

  // Pricing data configuration
  export const pricingData: { monthly: Plan; yearly: Plan } = {
    monthly: {
      id: "monthly",
      title: "Monthly Plan",
      price: 200,
      interval: "month",
      buttonText: "Get Started Monthly",
      isPopular: false,
    },
    yearly: {
      id: "yearly",
      title: "Yearly Plan",
      price: 1000,
      interval: "year",
      buttonText: "Get Started Yearly",
      isPopular: true,
    },
  };

  // Features configuration
  export const featureCategories: FeatureCategory[] = [
    {
      title: "Core Features",
      features: [
        { name: "Unlimited AI Voice Conversations", included: true },
        { name: "Personalized Learning Path", included: true },
        { name: "Progress Tracking", included: true },
      ],
    },
    {
      title: "Learning Tools",
      features: [
        { name: "Pronunciation Feedback", included: true },
        { name: "Grammar Correction", included: true },
        { name: "Vocabulary Enhancement", included: true },
      ],
    },
    {
      title: "Support",
      features: [
        { name: "24/7 Learning Support", included: true },
        { name: "Cross-Platform Access", included: true },
      ],
    },
  ];