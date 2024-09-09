import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-50  bottom-0  w-screen">
      <div className="max-lg:px-6 max-md:px-4 py-16 max-w-6xl mx-auto  flex flex-row max-md:flex-col justify-between items-center w-full gap-6">
        <div className="flex flex-row justify-center items-center gap-6 text-md ">
          <div className="w-20  aspect-square flex-shrink-0 flex items-center">
            <img src="/logo.png" alt="Logo" className="object-contain" />
          </div>
          <p className="text-nowrap">
            Achieve Fluency
            <br /> with Vanii Today!
          </p>
        </div>
        <div className="max-md:flex max-md:flex-row gap-6">
          <h3 className="max-w-xs text-lg max-md:text-md  text-primary-700 mb-6">
            We'd Like &<br /> Love to Help
          </h3>
          <ul className="flex flex-wrap gap-4 text-md max-md:text-sm">
            <li>
              <a href="mailto:aryan@vanii.ai" className="flex items-center gap-2">
                <img src="/Mail.svg" alt="Email Icon" className="w-8 h-8" />
                Email
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/vanii-ai" className="flex items-center gap-2">
                <img
                  src="/LinkedinLogo.svg"
                  alt="LinkedIn Icon"
                  className="w-8 h-8"
                />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="max-md:hidden">
          <ul className="flex flex-col gap-4 text-md ">
            <li className="transition duration-200 ease-custom hover:text-primary-700">
              <a href="#">Home</a>
            </li>
            <li className="transition duration-200 ease-custom hover:text-primary-700">
              <a href="#about-us">About Us</a>
            </li>
            <li className="transition duration-200 ease-custom hover:text-primary-700">
              <a href="#features">Features</a>
            </li>
            <li className="transition duration-200 ease-custom hover:text-primary-700">
              <a href="/blogs">Blog</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
