import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  safelist: ["bg-yellow", "bg-green", "bg-blue", "bg-purple", "bounce-up"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        violet: "#B3A7FE",
        yellow: "#F9DF6D",
        green: "#A0C35A",
        blue: "#B0C4EF",
        purple: "#BA81C5",
        gray: "#EFEFE6",
        "dark-gray": "#5A594E",
        "disabled-gray": "#7F7F7F",
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
        "fade-out": "fade-out 300ms ease-in forwards",
        "bounce-up": "bounce-up 400ms ease-in-out",
        shake: "shake 400ms ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        "bounce-up": {
          "0%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        shake: {
          "0%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(-5px)",
          },
          "50%": {
            transform: "translateX(5px)",
          },
          "75%": {
            transform: "translateX(-5px)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
