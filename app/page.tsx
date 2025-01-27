"use client"
import AboutSection from "@/app/components/AboutUs";
import FeaturesSection from "@/app/components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Header";
import Footer from "./components/Footer";
import RoomWrapper from "./shared/RoomInteractions/roomWrapper";
import {  useCallback, useState } from "react";
import { TimerProvider } from "@/context/TimerContext";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  const starttimer = useCallback((limit: number) => {
    if (timerStarted) return;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
      setTimerStarted(true);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsVisible(false);
    }, Number(limit) * 1000);
  }, [timerStarted]);

  return (
    <>
      <Navbar />
      <TimerProvider startTime={starttimer} currentTime={currentTime}>
        {isVisible && <RoomWrapper showChat={false} />}
      </TimerProvider>
      <AboutSection />
      <FeaturesSection />
      <CTA />
      <Footer />
    </>
  );
}
