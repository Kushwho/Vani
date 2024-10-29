import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const AboutSection = () => {
  
  return (
    <section id="about-us" className="py-24 bg-card">
      <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24 grid max-md:grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <h2 className="font-satoshi-medium text-4xl text-primary- font-bold">
              What We Are?
            </h2>
            <p className="mt-12 text-xl tracking-wider">
              An AI-based language learning platform designed to be your
              personal assistant in mastering a new language. Preparing for
              competitive exams like TOEFL, IELTS etc.? Want to improve your
              professional soft skills? Or maybe you just want to communicate
              better? Look no further. Our innovative AI-powered tool ensures
              that you receive the best learning experience tailored to your
              individual needs.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="img-transition rounded-medium min-h-[29rem] relative">
              <Image
                src="/images/home/aboutUs1.webp"
                alt="abstract 3d image of blocks depicting language learning"
                fill
                priority
                className="transition-transform duration-1000 ease-in-out rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
