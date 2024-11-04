import React from "react";
import { Sparkles } from "lucide-react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import { pricingData } from "@/lib/data/pricing";
import { renderPriceCard } from "./components/pricingcard";

// Define types for the pricing plans and features

const PricingPage: React.FC = () => {



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-primary-50/50 via-white to-primary-50/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-100/50 px-4 py-2 rounded-full text-primary-700 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                Choose Your Perfect Plan
              </span>
            </div>
            <h1 className="text-5xl font-bold text-primary-900 mb-4 leading-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Start your journey to English fluency today with our flexible
              pricing plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.values(pricingData).map((plan) => renderPriceCard(plan))}
          </div>

          <div className="mt-20 text-center">
            <div className="bg-primary-50/50 rounded-2xl p-8 max-w-3xl mx-auto">
              <p className="text-gray-600 text-lg leading-relaxed">
                All plans include access to our full suite of features. Start
                with any plan and upgrade or downgrade anytime. Need help
                choosing?{" "}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 font-medium underline decoration-2 underline-offset-4"
                >
                  Contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;
