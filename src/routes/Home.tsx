import AboutUs from "@/Components/Home/AboutUs";
import CTA from "@/Components/Home/CTA";
import Features from "@/Components/Home/Features";
import HeroSection from "@/Components/Home/HeroSection";
import StepForm from "@/Components/Home/OnBoardingForm";
import Testimonials from "@/Components/Home/Testimonials";
import { FC } from "react";

const Home: FC = () => {
  return (
    <>
      <main className="">
        {/* Hero Section */}
        <HeroSection />

        {/* About Us Section */}
        <AboutUs />
        {/* Features Section */}
        <Features />
        {/* Testimonials Section */}
        <Testimonials />
        <StepForm />

        <CTA />
      </main>
    </>
  );
};

export default Home;
