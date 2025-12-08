/** @type {import('tailwindcss').Config} */
module.exports = {
  experimental: {
    // Nonaktifkan parsing warna OKLCH/LAB bawaan Tailwind 4
    disableColorScheme: true,
  },
  theme: {
    extend: {},
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
};
