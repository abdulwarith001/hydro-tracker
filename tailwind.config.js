/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "poppins-black": ["PoppinsBlack", "serif"],
        "poppins-semibold": ["PoppinsSemiBold", "serif"],
        "poppins-regular": ["PoppinsRegular", "serif"],
        "poppins-bold": ["PoppinsBold", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
