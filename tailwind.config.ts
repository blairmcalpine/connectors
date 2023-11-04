import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
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
      },
    },
  },
  plugins: [],
} satisfies Config;
