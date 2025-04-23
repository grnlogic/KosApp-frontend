module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#FFCC00",
          light: "#FFE380",
          dark: "#FF9500",
        },
        secondary: {
          DEFAULT: "#FF7A00",
          light: "#FF9A40",
          dark: "#E56A00",
        },
        background: {
          light: "#FFF8E7",
          DEFAULT: "#FFF8E7",
          dark: "#F5EBD7",
        },
      },
    },
  },
  plugins: [],
};
