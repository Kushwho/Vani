import { FC } from "react";

const Testimonials: FC = () => {
  return (
    <>
      <section id="testimonials" className="py-20">
        <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24 grid max-md:grid-cols-1 md:grid-cols-[0.6fr_0.4fr] grid-rows-[3.4rem_auto] gap-8">
          <h2 className="font-satoshi-medium text-2xl text-primary-700">
            Voices of Success
          </h2>
          <div className="img-transition rounded-lg max-h-[18rem] w-full aspect-video">
            <img
              src="/assets/images/3d-2.jpg"
              alt="abstract 3d image of a building"
              className="transition-transform duration-1000 ease-in-out rounded-lg"
            />
          </div>

          <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-8">
            <article className="flex flex-col gap-3">
              <div className="max-w-20 aspect-square">
                <img src="/assets/images/avatar-1.png" alt="avatar 1" />
              </div>
              <p className="font-satoshi-light text-md">
                "The personalized learning experience at Vanii has been a
                game-changer for me. The AI adapts to my pace and learning
                style, making it incredibly effective and enjoyable."
              </p>
              <span className="font-satoshi-medium">- Emily Chen</span>
            </article>

            <article className="flex flex-col gap-3">
              <div className="max-w-20 aspect-square">
                <img src="/assets/images/avatar-2.png" alt="avatar 2" />
              </div>
              <p className="font-satoshi-light text-md">
                "Vanii's innovative approach to language learning has made a
                significant impact on my career. The interactive sessions have
                boosted my confidence & enhanced my communication skills."
              </p>
              <span className="font-satoshi-medium">- Ayumi Sato</span>
            </article>

            <article className="flex flex-col gap-3">
              <div className="max-w-20 aspect-square">
                <img src="/assets/images/avatar-3.png" alt="avatar 3" />
              </div>
              <p className="font-satoshi-light text-md">
                "I love the community aspect of Vanii. Being able to connect
                with other learners and share experiences has enriched my
                learning journey and broadened my cultural perspective."
              </p>
              <span className="font-satoshi-medium">- Rahul Sharma</span>
            </article>

            <article className="flex flex-col gap-3">
              <div className="max-w-20 aspect-square">
                <img src="/assets/images/avatar-4.png" alt="avatar 4" />
              </div>
              <p className="font-satoshi-light text-md">
                "The AI teacher at Vanii is truly remarkable. It provides
                instant feedback and personalized recommendations, helping me to
                constantly improve my language skills in a fun way."
              </p>
              <span className="font-satoshi-medium">- Sophie Johnson</span>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
