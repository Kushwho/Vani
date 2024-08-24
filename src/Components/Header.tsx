import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../Hooks/useAuthContext";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import Logout from "@/services/Login/Logout";

import { toast } from "react-toastify";
import { useAxiosContext } from "@/Hooks/useAxiosContext";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const { dimensions } = useWindowDimensions();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const axios = useAxiosContext();

  useEffect(() => {
    const handleResize = () => setIsMobile(dimensions.width < 768);

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dimensions.width]);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setIsSticky(window.scrollY > ref.current.scrollHeight);
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggle = () => setIsActive(!isActive);

  const menuContainerClasses = useMemo(() => {
    return `menu-container flex items-center ${
      isMobile
        ? "absolute h-[100vh] inset-0  bg-primary-50 transform transition-transform duration-300 ease-in-out justify-center"
        : "gap-10"
    } ${
      isActive && isMobile
        ? "translate-x-0 z-50"
        : isMobile
        ? "translate-x-full"
        : ""
    }`;
  }, [isActive, isMobile]);

  const menuItemsClasses = useMemo(() => {
    return `menu-items flex flex-col md:flex-row md:items-center gap-10 ${
      isMobile && isActive ? "block" : "hidden"
    } md:block`;
  }, [isMobile, isActive]);

  const hamburgerClasses = useMemo(() => {
    return `block w-8 h-1 bg-primary-700 rounded transition-transform duration-500 ease-in-out ${
      isActive ? "transform rotate-45 translate-y-2" : "translate-y-2"
    }`;
  }, [isActive]);

  const hamburgerClasses2 = useMemo(() => {
    return `block w-8 h-1 bg-primary-700 rounded transition-transform duration-500 ease-in-out ${
      isActive ? "transform -rotate-45" : "-translate-y-2"
    }`;
  }, [isActive]);

  return (
    <header
      className={`p-4 px-16 w-full bg-primary-50 transition-all duration-300 ${
        isSticky ? "fixed top-0 w-full z-50 bg-opacity-50 backdrop-blur-sm" : ""
      }`}
      ref={ref}
    >
      <nav className="flex max-w-6xl mx-auto items-center justify-between">
        <a href="/" className="w-14">
          <img src="/logo.png" alt="vanii logo" />
        </a>
        <div className={menuContainerClasses}>
          <div className={menuItemsClasses}>
            <ul className="flex flex-col justify-center items-center md:flex-row gap-6 text-md">
              <li>
                <a
                  href="/"
                  className="hover:text-primary-700 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#about-us"
                  className="hover:text-primary-700 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#features"
                  className="hover:text-primary-700 transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  className="hover:text-primary-700 transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              {authContext?.primaryValues.loggedIn ? (
                <li>
                  <a
                    href="/record"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    Start Learning
                  </a>
                </li>
              ) : (
                <> </>
              )}
              <li className="mx-2">
                <button
                  id="btn-get-started"
                  className="py-2 px-5 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => {
                    if (!authContext?.primaryValues.loggedIn) {
                      navigate("/signup");
                    } else {
                      Logout(axios)
                        .then(() => {
                          toast.success("Logged out successfully");
                          authContext.setPrimaryValues({
                            loggedIn: false,
                            id: "",
                            email: "",
                            voice:""
                          });
                        })
                        .catch(() => {
                          toast.error("Failed to logout");
                        });
                    }
                  }}
                >
                  {authContext?.primaryValues.loggedIn
                    ? "Logout"
                    : "Get started"}
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isMobile && (
          <div
            className="menu-hamburger cursor-pointer md:hidden z-50"
            onClick={handleToggle}
          >
            <span className={hamburgerClasses}></span>
            <span className={hamburgerClasses2}></span>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
