import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featureCategories, pricingData } from "@/lib/data/pricing";
import { Plan } from "@/types/pricing";
import { Check, Sparkles } from "lucide-react";
const calculateSavings = () => {
  const monthlyAnnualCost = pricingData.monthly.price * 12;
  const yearlyPlan = pricingData.yearly.price;
  const savings = monthlyAnnualCost - yearlyPlan;
  const savingsPercentage = Math.round((savings / monthlyAnnualCost) * 100);
  return { savings, savingsPercentage };
};

const { savings, savingsPercentage } = calculateSavings();

// Price formatter
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
export const renderPriceCard = (plan: Plan) => {
  const isYearly = plan.id === "yearly";

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 pb-20
          ${
            isYearly
              ? "border-2 border-primary-500 shadow-xl hover:shadow-2xl"
              : "border border-primary-100 hover:border-primary-300"
          }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {isYearly && (
        <div className="absolute -right-12 top-8 rotate-45 bg-primary-600 text-primary py-2 px-12 shadow-lg">
          <span className="font-bold text-lg">Save {savingsPercentage}%</span>
        </div>
      )}

      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl font-bold text-primary-900 mb-6">
          {plan.title}
        </CardTitle>
        <div className="mt-4">
          <span className="text-5xl font-bold text-primary-900">
            {formatPrice(plan.price)}
          </span>
          <span className="text-gray-600 ml-2 text-lg">/{plan.interval}</span>
        </div>
        {isYearly && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-primary-700 font-medium">
                Save {formatPrice(savings)} yearly
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {featureCategories.map((category, idx) => (
          <div key={category.title} className={idx !== 0 ? "mt-6" : ""}>
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              {category.title}
            </h3>
            <ul className="space-y-5">
              {category.features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-start gap-3 group/item"
                >
                  <Check className="h-5 w-5 text-primary-600 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                  <span className="text-gray-600 group-hover/item:text-primary-900 transition-colors">
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>

      <CardFooter className="absolute bottom-0 mx-auto w-full">
        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-primary text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
