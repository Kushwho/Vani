"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const CTA: FC = () => {
  return (
    <section id="cta" className="max-md:px-8 md:px-24 py-20 bg-card">
      <Card className="max-w-screen-xl mx-auto my-12">
        <CardContent
          className="flex flex-col justify-center items-center p-24 text-center bg-gradient-to-t from-black/20 to-black/20 bg-cover bg-no-repeat rounded-md"
          style={{ backgroundImage: "url('/images/home/cta.webp')" }}
        >
          <h2 className="mb-8 font-satoshi-bold text-card text-4xl">
            Join the Vanii Community and Learn!
          </h2>
          <Button
        variant="default"
            className="bg-primary text-primary-50 hover:bg-primary-700"
            onClick={() =>
              window.open("https://chat.whatsapp.com/L9i9d2ody5DCdb8Z6PJHT4")
            }
          >
            <span className="text-white text-lg">Join Community</span>
            <ArrowRight className="ml-2 w-6 h-6 transition-transform duration-200 ease-in-out hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default CTA;
