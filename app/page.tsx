"use client";
import AboutSection from "@/app/components/AboutUs";
import FeaturesSection from "@/app/components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Header";
import Footer from "./components/Footer";
import RoomWrapper from "./shared/RoomInteractions/roomWrapper";
import { useTimerStore } from "./components/demo/TimerStore";
import { Button } from "@/components/ui/button";
import useAuthContext from "@/hooks/custom/useAuthContext";

export default function Home() {
  const { isVisible, toggleVisibiliy } = useTimerStore();
  const auth = useAuthContext();

  return (
    <>
      <Navbar />

      {!auth.config.loggedIn ? (
        !isVisible ? (
          <div className="w-screen flex">
            <Button className="mx-auto" onClick={() => toggleVisibiliy(true)}>
              Demo Please
            </Button>
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}

      {isVisible && <RoomWrapper showChat={false} />}

      <AboutSection />
      <FeaturesSection />
      <CTA />
      <Footer />
    </>
  );
}
