const fs = require("fs");
const postcss = require("postcss");
const plugin = require("tailwindcss/plugin");
import {
  scopedPreflightStyles,
  isolateInsideOfContainer,
  isolateOutsideOfContainer,
} from "tailwindcss-scoped-preflight";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "satoshi-light": ["Satoshi-Light", "sans-serif"],
        "satoshi-regular": ["Satoshi-Regular", "sans-serif"],
        "satoshi-medium": ["Satoshi-Medium", "sans-serif"],
        "satoshi-bold": ["Satoshi-Bold", "sans-serif"],
      },
      fontSize: {
        "4xl": "3.8rem",
        "2xl": "2.4rem",
        xl: "1.9rem",
        lg: "1.6rem",
        md: "1.25rem",
        base: "1rem",
      },
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fef2c7",
          200: "#fce38a",
          300: "#fbcf4e",
          400: "#f9ba26",
          500: "#f3990d",
          600: "#d77308",
          700: "#b3500a",
          800: "#913d0f",
          900: "#773310",
          950: "#441904",
        },

        neutral: {
          50: "#ffffff",
          75: "#f9fafb",
          100: "#efefef",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#7c7c7c",
          600: "#656565",
          700: "#525252",
          800: "#464646",
          900: "#3d3d3d",
          950: "#292929",
        },
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1792px",
        "4xl": "2048px",
        "5xl": "2304px",
        "6xl": "2560px",
        "7xl": "2816px",
        "8xl": "3072px",
        "9xl": "3328px",
        "10xl": "3584px",
        "11xl": "3840px",
      },
      lineHeight: {
        btn: "normal",
        heading: "124%",
      },
      borderRadius: {
        small: "6px",
        medium: "12px",
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.46, 0.03, 0.52, 0.96)",
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateOutsideOfContainer(".twp", {
        except: ".twp", // optional, to exclude some elements under .twp from being preflighted, like external markup
      }),
    }),
  ],
};
