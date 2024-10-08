/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        main: "#5b7898",
      },
      animation: {
        marquee: "marquee var(--marquee-duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--marquee-duration) linear infinite",
      },
      keyframes: {
        marquee: {
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-vertical": {
          "100%": { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
