import useAuthContext from "@/Hooks/useAuthContext";
import { FC } from "react";
import { useNavigate } from "react-router";

const HeroSection: FC = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  return (
    <section id="hero" className="observe bg-primary-50 py-14">
      <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24 flex flex-col justify-center items-center gap-16">
        <h1 className="font-satoshi-medium text-4xl leading-tight text-center bg-gradient-to-r from-black to-primary-600 bg-clip-text text-transparent">
          India’s AI for Spoken English Learning
        </h1>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8 items-center">
          <div
            className="rounded-medium h-full min-h-[29rem] bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/img-1.webp')" }}
          ></div>
          <div className="flex flex-col h-full w-full gap-8">
            <div className="p-8 rounded-medium border bg-primary-100 flex flex-col items-start gap-6">
              <h2 className="font-satoshi-medium text-lg">
                Quick Onboarding | Speaking with AI | Personalized Learning |
                Automated Processes
              </h2>
              <p className="text-md">
                At Vanii, our mission is to make language learning accessible,
                personalized, practical and enjoyable for everyone, regardless
                of their background or location.
              </p>
              <div className="flex flex-wrap gap-5">
                <button
                  className="py-2 px-5 animate-pulse transition-all rounded-small font-satoshi-medium text-md border-2 border-dashed border-primary-700 text-primary-700"
                  onClick={() =>
                    auth?.primaryValues.loggedIn
                      ? navigate("/record")
                      : navigate("#about-us")
                  }
                >
                  {auth?.primaryValues.loggedIn
                    ? "Start Learning"
                    : "Learn More"}
                </button>
              </div>
            </div>
            <img
              src="/assets/images/3d-4.webp"
              className="rounded-medium h-30 bg-cover bg-center"
              alt="Webp image not found"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
