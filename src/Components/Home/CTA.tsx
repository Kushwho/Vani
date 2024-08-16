import useAuthContext from "@/Hooks/useAuthContext";
import { FC } from "react";
import { useNavigate } from "react-router";

const CTA: FC = () => {
  const auth = useAuthContext()
  const navigate = useNavigate()
  return (
    <>
      <section id="cta" className="px-24 py-0 bg-9">
        <div
          className="max-w-[78rem] mx-auto my-12 bg-gradient-to-t from-black/20 to-black/20 bg-[] bg-cover bg-no-repeat bg-[length:cover] rounded-md p-24 text-center"
          style={{ backgroundImage: "url('/assets/images/3d-5.webp')" }}
        >
          <h2 className="mb-8 font-satoshi-bold text-primary-50 text-2xl">
            Join the Vanii Community and Learn!
          </h2>
          {!auth?.primaryValues.loggedIn? <button
            id="btn-view-jobs"
            className="flex items-center justify-center gap-2 mx-auto px-5 py-3 bg-primary-600 text-primary-50 font-satoshi-medium text-md rounded-sm transition-transform duration-200 ease-in-out hover:bg-primary-700 hover:translate-x-1"
            onClick={() => navigate("/signup")}
          >
            <span>Get started</span>
            <img
              src="/assets/icons/ArrowRight.svg"
              alt="arrow icon"
              className="w-6 h-6 transition-transform duration-200 ease-in-out hover:translate-x-1"
            />
          </button>:<></>}
        </div>
      </section>
    </>
  );
};

export default CTA;
