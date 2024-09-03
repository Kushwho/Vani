import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthContext from "../Hooks/useAuthContext";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import Logout from "@/services/Login/Logout";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { dimensions } = useWindowDimensions();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const axios = useAxiosContext();

  const isMobile = useMemo(() => dimensions.width < 768, [dimensions.width]);

  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleToggle = useCallback(() => setIsActive((prev) => !prev), []);

  const handleLogout = useCallback(() => {
    Logout(axios)
      .then(() => {
        toast.success("Logged out successfully");
        authContext?.setPrimaryValues({
          loggedIn: false,
          id: "",
          email: "",
          voice: "",
        });
      })
      .catch(() => {
        toast.error("Failed to logout");
      });
  }, [axios, authContext]);

  const menuContainerClasses = useMemo(
    () => `
    menu-container flex items-center
    ${
      isMobile
        ? "fixed inset-0 bg-primary-50 transform transition-all duration-300 ease-in-out justify-center"
        : "gap-10"
    }
    ${
      isActive && isMobile
        ? "translate-x-0 z-50"
        : isMobile
        ? "translate-x-full"
        : ""
    }
  `,
    [isActive, isMobile]
  );

  const menuItemsClasses = useMemo(
    () => `
    menu-items flex flex-col md:flex-row md:items-center gap-10
    ${isMobile && isActive ? "block" : "hidden md:block"}
  `,
    [isMobile, isActive]
  );

  const hamburgerClasses = useMemo(
    () => `
    block w-8 h-1 bg-primary-700 rounded transition-all duration-300 ease-in-out
    ${isActive ? "transform rotate-45 translate-y-2" : "translate-y-2"}
  `,
    [isActive]
  );

  const hamburgerClasses2 = useMemo(
    () => `
    block w-8 h-1 bg-primary-700 rounded transition-all duration-300 ease-in-out
    ${isActive ? "transform -rotate-45" : "-translate-y-2"}
  `,
    [isActive]
  );

  return (
    <header
      className={`p-4 px-16 w-full bg-primary-50 transition-all duration-300 ${
        isSticky ? "fixed top-0 w-full z-50 bg-opacity-50 backdrop-blur-sm" : ""
      }`}
    >
      <nav className="flex max-w-6xl mx-auto items-center justify-between">
        <Link to="/" className="w-14">
          <img src="/logo.png" alt="vanii logo" />
        </Link>
        <div className={menuContainerClasses}>
          <div className={menuItemsClasses}>
            <ul className="flex flex-col justify-center items-center md:flex-row gap-6 text-md">
              {["Home", "About Us", "Features"].map((item) => (
                <li key={item}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/#${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li key={4}>
                <Link
                  to="/blogs"
                  className="hover:text-primary-700 transition-colors duration-200"
                >
                  Blogs
                </Link>
              </li>
              {authContext?.primaryValues.loggedIn && (
                <li>
                  <Link
                    to="/record"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    Start Learning
                  </Link>
                </li>
              )}
              <li className="mx-2">
                <button
                  id="btn-get-started"
                  className="py-2 px-5 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() =>
                    authContext?.primaryValues.loggedIn
                      ? handleLogout()
                      : navigate("/signup")
                  }
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
          <>
            <a className="text-md flex items-center transition-all animate-pulse text-primary-700">
              {authContext?.primaryValues.loggedIn
                ? "Start Learning"
                : "Get Started"}
            </a>
            <button
              className="menu-hamburger cursor-pointer md:hidden z-50"
              onClick={handleToggle}
              aria-label="Toggle menu"
            >
              <span className={hamburgerClasses}></span>
              <span className={hamburgerClasses2}></span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default React.memo(Navbar);
