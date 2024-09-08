import { FC } from "react";

const Features: FC = () => {
  return (
    <>
      <section id="features" className="bg-primary-50 py-20">
        <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24">
          <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <h2 className="font-satoshi-medium text-2xl text-primary-700 max-w-xl  max-md:mb-1 font-semibold">
              Bridging Language Barriers, Opening Doors
            </h2>
            <p className="text-md">
              Our vision is to bridge the language gap and empower individuals
              with the skills they need to succeed in a globalized world. We
              believe that language should never be a barrier to opportunities
              and growth. Connecting across borders and bringing together
              cultures, we aim to make language learning affordable, accessible
              and efficient.
            </p>
          </div>

          <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-8">
            <article className="grid grid-cols-[auto_auto] gap-4 items-center p-8 bg-primary-100 border rounded-medium transition duration-200 hover:bg-primary-600 hover:text-neutral-50">
              <div className="grid place-items-center max-w-20 aspect-square p-4 rounded-full bg-primary-600 transition duration-200 hover:border-primary-50 max-md:hidden">
                <img src="/assets/icons/Curate.svg" alt="curate icon" />
              </div>
              <div>
                <h3 className="font-satoshi-medium text-lg  max-md:mb-1 font-semibold">
                  Hyper-Realistic Language Teacher
                </h3>
                <p className="align-self-start text-md">
                  Our platform uses advanced AI to provide personalized learning
                  experiences. This AI teacher evolves to meet your needs,
                  helping you communicate effectively.
                </p>
              </div>
            </article>

            <article className="grid grid-cols-[auto_auto] gap-4 items-center p-8 bg-primary-100 border rounded-medium transition duration-200 hover:bg-primary-600 hover:text-neutral-50">
              <div className="grid place-items-center max-w-20 aspect-square p-4 rounded-full bg-primary-600 transition duration-200 hover:border-primary-50 max-md:hidden">
                <img
                  src="/assets/icons/Personalize.svg"
                  alt="personalize icon"
                />
              </div>
              <div>
                <h3 className="font-satoshi-medium text-lg  max-md:mb-1 font-semibold">
                  Personalized Feedback
                </h3>
                <p className="align-self-start text-md">
                  Get instant feedback to improve. Add new words to your
                  vocabulary, make fewer grammatical errors, and speak with more
                  confidence.
                </p>
              </div>
            </article>

            <article className="grid grid-cols-[auto_auto] gap-4 items-center p-8 bg-primary-100 border rounded-medium transition duration-200 hover:bg-primary-600 hover:text-neutral-50">
              <div className="grid place-items-center max-w-20 aspect-square p-4 rounded-full bg-primary-600 transition duration-200 hover:border-primary-50 max-md:hidden">
                <img src="/assets/icons/Culture.svg" alt="culture icon" />
              </div>
              <div>
                <h3 className="font-satoshi-medium text-lg  max-md:mb-1 font-semibold">
                  Interactive Sessions
                </h3>
                <p className="align-self-start text-md ">
                  Engage in interactive learning sessions for dynamic education.
                  Gain confidence through real-world scenarios and practice
                  activities.
                </p>
              </div>
            </article>

            <article className="grid grid-cols-[auto_auto] gap-4 items-center p-8 bg-primary-100 border rounded-medium transition duration-200 hover:bg-primary-600 hover:text-neutral-50">
              <div className="grid place-items-center max-w-20 aspect-square p-4 rounded-full bg-primary-600 transition duration-200 hover:border-primary-50 max-md:hidden">
                <img src="/assets/icons/Community.svg" alt="community icon" />
              </div>
              <div>
                <h3 className="font-satoshi-medium text-lg  max-md:mb-1 font-semibold">
                  Community Support
                </h3>
                <p className="align-self-start text-md">
                  Join a global learning community. Share experiences and tips.
                  Complement your AI teacher with peer support and cultural
                  exchange.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
