import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          50: "#fff8ed",
          100: "#feedd2",
          200: "#fcd6a4",
          300: "#f9b76c",
          400: "#f69033",
          500: "#f16e0e",
          600: "#df5308",
          700: "#b93c0a",
          800: "#933110",
          900: "#772a10",
        },
        sand: {
          50: "#fbf9f4",
          100: "#f4f0e6",
          200: "#e9dfcb",
          300: "#dbc7a9",
          400: "#caa983",
          500: "#bc8e63",
          600: "#ab7a54",
          700: "#8e6145",
          800: "#74503c",
          900: "#604234",
        },
        navy: {
          800: "#141c2b",
          900: "#0b1120",
          950: "#060913",
        }
      },
    },
  },
  plugins: [],
};
export default config;

