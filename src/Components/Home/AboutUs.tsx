import React, { FC, useState, useEffect } from "react";

const AboutUs: FC = () => {
  return (
    <>
      <section id="about-us" className="py-24">
        <div className="max-w-screen-xl mx-auto max-md:px-8 md:px-24 grid max-md:grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-satoshi-medium text-2xl text-primary-700">
              What We Are?
            </h2>
            <p className="mt-12 text-md">
              An AI-based language learning platform designed to be your
              personal assistant in mastering a new language. Preparing for
              competitive exams like TOEFL, IELTS etc.? Want to improve your
              professional soft skills? Or maybe you just want to communicate
              better? Look no further. Our innovative AI-powered tool ensures
              that you receive the best learning experience tailored to your
              individual needs.
            </p>
          </div>
          <div className="img-transition rounded-medium max-h-[29rem]">
            <img
              src="/assets/images/3d-1.webp"
              alt="abstract 3d image of blocks depicting language learning"
              className="transition-transform duration-1000 ease-in-out rounded-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
