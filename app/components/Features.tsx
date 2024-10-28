"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "/images/icons/Curate.svg",
    title: "Hyper-Realistic Language Teacher",
    description:
      "Our platform uses advanced AI to provide personalized learning experiences. This AI teacher evolves to meet your needs, helping you communicate effectively.",
  },
  {
    icon: "/images/icons/Personalize.svg",
    title: "Personalized Feedback",
    description:
      "Get instant feedback to improve. Add new words to your vocabulary, make fewer grammatical errors, and speak with more confidence.",
  },
  {
    icon: "/images/icons/Culture.svg",
    title: "Interactive Sessions",
    description:
      "Engage in interactive learning sessions for dynamic education. Gain confidence through real-world scenarios and practice activities.",
  },
  {
    icon: "/images/icons/Community.svg",
    title: "Community Support",
    description:
      "Join a global learning community. Share experiences and tips. Complement your AI teacher with peer support and cultural exchange.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-primary-50 py-20">
      <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24">
        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <h2 className="font-satoshi-medium text-3xl text-primary-700 max-w-xl max-md:mb-1 font-semibold">
            Bridging Language Barriers, Opening Doors
          </h2>
          <p className="text-md">
            Our vision is to bridge the language gap and empower individuals
            with the skills they need to succeed in a globalized world. We
            believe that language should never be a barrier to opportunities and
            growth. Connecting across borders and bringing together cultures, we
            aim to make language learning affordable, accessible and efficient.
          </p>
        </div>

        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border bg-primary-100 transition-colors duration-200 hover:bg-primary-600 hover:text-neutral-50"
            >
              <CardContent className="p-8">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <div className="grid place-items-center max-w-20 aspect-square p-4 rounded-full bg-primary-600 transition duration-200 group-hover:border-primary-50 max-md:hidden">
                    <Image
                      src={feature.icon}
                      alt={`${feature.title} icon`}
                      width={40}
                      height={40}
                      className="h-auto w-auto"
                    />
                  </div>
                  <div>
                    <h3 className="font-satoshi-medium text-lg max-md:mb-1 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="align-self-start text-md">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
