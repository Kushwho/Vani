"use client";
import AboutSection from "@/app/components/AboutUs";
import FeaturesSection from "@/app/components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Header";
import Footer from "./components/Footer";
import RoomWrapper from "./shared/RoomInteractions/roomWrapper";
import { useTimerStore } from "./components/demo/TimerStore";

export default function Home() {
  const { isVisible } = useTimerStore();

  return (
    <>
      <Navbar />

      {isVisible && <RoomWrapper showChat={false} />}

      <AboutSection />
      <FeaturesSection />
      <CTA />
      <Footer />
    </>
  );
}
