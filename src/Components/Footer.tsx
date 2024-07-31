import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-50">
      <div className=" py-16 max-w-6xl mx-auto  flex flex-row justify-between items-center w-full">
        <div className="flex  items-center gap-6 text-md">
          <div className="w-20 aspect-square flex-shrink-0 flex items-center">
            <img src="/logo.png" alt="Logo" className="object-contain" />
          </div>
          <p>
            Achieve Fluency
            <br /> with Vanii Today!
          </p>
        </div>
        <div>
          <h3 className="max-w-xs text-lg text-primary-700 mb-6">
            We'd Like &<br /> Love to Help
          </h3>
          <ul className="flex flex-wrap gap-4 text-md">
            <li>
              <a href="#" className="flex items-center gap-2">
                <img
                  src="/Mail.svg"
                  alt="Email"
                  className="w-8 h-8"
                />
                Email
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2">
                <img
                  src="/XLogo.svg"
                  alt="Twitter"
                  className="w-8 h-8"
                />
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2">
                <img
                  src="/LinkedinLogo.svg"
                  alt="LinkedIn"
                  className="w-8 h-8"
                />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="max-md:hidden">
          <ul className="flex flex-col gap-4 text-md">
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
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
