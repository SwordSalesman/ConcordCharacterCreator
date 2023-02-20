/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        bordevar: "url('/src/data/images/realm-logos/Bbw.jpg')",
        andash: "url('/src/data/images/realm-logos/Abw.jpg')",
        greenweald: "url('/src/data/images/realm-logos/Gbw.jpg')",
        ironvalley: "url('/src/data/images/realm-logos/IVbw.jpg')",
        leronamere: "url('/src/data/images/realm-logos/LMbw.jpg')",
      },
    },
  },
  plugins: [],
};
