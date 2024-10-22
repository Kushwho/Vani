import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthContext from "../Hooks/useAuthContext";
import { useWindowResize } from "../Hooks/useWindowSize";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import Logout from "@/services/Login/Logout";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { width } = useWindowResize();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const axios = useAxiosContext();

  const isMobile = useMemo(() => width < 768, [width]);

  const handleScroll = useCallback(() => {
    if (isActive) {
      setIsSticky(false);
    } else {
      setIsSticky(window.scrollY > 0);
    }
  }, [isActive]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isActive && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isActive, isMobile]);

  const handleToggle = useCallback(() => {
    setIsActive((prev) => !prev);
    setIsSticky(false);
  }, []);

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
        navigate("/"); // Redirect to home after logout
      })
      .catch(() => {
        toast.error("Failed to logout");
      });
  }, [axios, authContext, navigate]);

  // Classes for the menu container based on active state and screen size
  const menuContainerClasses = useMemo(
    () => `
      fixed inset-0 bg-primary-50 transform transition-transform duration-300 ease-in-out
      ${
        isMobile
          ? isActive
            ? "translate-x-0 z-40"
            : "translate-x-full z-40"
          : "relative z-auto"
      }
      flex ${isMobile ? "flex-col items-center justify-center" : "flex-row"}
    `,
    [isActive, isMobile]
  );

  // Classes for the navigation links
  const menuItemsClasses = useMemo(
    () => `
      flex ${isMobile ? "flex-col items-center gap-6" : "flex-row gap-10"}
    `,
    [isMobile]
  );

  // Classes for the hamburger lines
  const hamburgerLineClasses = (isActive: boolean, rotate: boolean) => `
    block w-8 h-1 bg-primary-700 rounded transition-transform duration-300 ease-in-out
    ${
      isActive
        ? rotate
          ? "rotate-45 translate-y-2"
          : "-rotate-45 -translate-y-2"
        : ""
    }
  `;

  return (
    <header
      className={`p-4 px-16 max-md:px-8 w-full bg-primary-50 transition-all duration-300 ${
        isSticky && !isActive
          ? "fixed top-0 w-full z-30 bg-opacity-50 backdrop-blur-sm"
          : ""
      }`}
    >
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Left Section: Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.png" alt="Vanii Logo" className="w-14" />
        </Link>

        {/* Center Section: Navigation Links */}
        {/* Hide on mobile */}
        {!isMobile && (
          <ul className="flex space-x-10 md:text-md max-md:text-sm">
            {["About Us", "Features", "Blogs"].map((item) => (
              <li key={item}>
                {item === "Blogs" ? (
                  <Link
                    to="/blogs"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    href={`/#${item.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    {item}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Right Section: Login/Signup Buttons */}
        {/* Hide on mobile */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            {authContext?.primaryValues.loggedIn ? (
              <button
                className="py-2 px-5 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="py-2 px-5 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="py-2 px-5 rounded border-2 border-primary-400 text-primary-600 hover:border-primary-700 transition-colors duration-200"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile: Hamburger Menu */}
        {isMobile && (
          <button
            className="fixed right-6 top-6 z-50 flex flex-col space-y-1.5"
            onClick={handleToggle}
            aria-label="Toggle menu"
          >
            <span className={hamburgerLineClasses(isActive, true)}></span>
            <span className={hamburgerLineClasses(isActive, false)}></span>
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div className={menuContainerClasses}>
          <ul className={`${menuItemsClasses} `}>
            {["About Us", "Features", "Blogs"].map((item) => (
              <li key={item}>
                {item === "Blogs" ? (
                  <Link
                    to="/blogs"
                    className="text-md hover:text-primary-700 transition-colors duration-200"
                    onClick={() => setIsActive(false)}
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    href={`/#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-md hover:text-primary-700 transition-colors duration-200"
                    onClick={() => setIsActive(false)}
                  >
                    {item}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {authContext?.primaryValues.loggedIn ? (
              <button
                className="w-full py-2 px-5 mb-4 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                onClick={() => {
                  handleLogout();
                  setIsActive(false);
                }}
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col space-y-4">
                <button
                  className="w-full py-2 px-5 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => {
                    navigate("/login");
                    setIsActive(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="w-full py-2 px-5 rounded border-2 border-primary-400 text-primary-600 hover:border-primary-700 transition-colors duration-200"
                  onClick={() => {
                    navigate("/signup");
                    setIsActive(false);
                  }}
                >
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default React.memo(Navbar);
