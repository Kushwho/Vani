import { FC } from "react";

const CTA: FC = () => {
  return (
    <>
      <section id="cta" className="max-md:px-8 md:px-24 py-20 bg-9">
        <div
          className="max-w-screen-xl mx-auto my-12 bg-gradient-to-t flex flex-col justify-center items-center from-black/20 to-black/20 bg-[] bg-cover bg-no-repeat bg-[length:cover] rounded-md p-24 text-center"
          style={{ backgroundImage: "url('/assets/images/3d-5.webp')" }}
        >
          <h2 className="mb-8 font-satoshi-bold text-primary-50 text-2xl">
            Join the Vanii Community and Learn!
          </h2>

          <button
            id="btn-view-jobs"
            className="py-2 px-5 rounded flex flex-row bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
            onClick={() =>
              window.open("https://chat.whatsapp.com/L9i9d2ody5DCdb8Z6PJHT4")
            }
          >
            <span className="text-white text-nowrap">Join Community</span>
            <img
              src="/assets/icons/ArrowRight.svg"
              alt="arrow icon"
              className="ml-2 mr-2 w-6 h-6 transition-transform duration-200 ease-in-out hover:translate-x-1"
            />
          </button>
        </div>
      </section>
    </>
  );
};

export default CTA;
