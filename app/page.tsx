import AboutSection from "@/app/components/AboutUs";
import Hero from "@/app/components/Hero";
import FeaturesSection from "@/app/components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <CTA />
      <Footer />
    </>
  );
}
