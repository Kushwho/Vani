export type Plan = {
    id: string;
    title: string;
    price: number;
    interval: "month" | "year";
    buttonText: string;
    isPopular: boolean;
  };
  
  export type Feature = {
    name: string;
    included: boolean;
  };
  
  export type FeatureCategory = {
    title: string;
    features: Feature[];
  };