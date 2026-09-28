/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2D9CFF",
          dark: "#1E7EC8",
          light: "#E6F2FF",
        },
        slate: {
          750: "#162032",
          850: "#0f172a",
          950: "#0b1120",
        },
        brand: {
          blue: "#2D9CFF",
          darkBlue: "#1E7EC8",
          lightBlue: "#E6F2FF",
          card: "#1e293b",
        }
      },
    },
  },
  plugins: [],
};
