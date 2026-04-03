import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jetson: {
          green: '#3CD567',
          'green-dark': '#2BB854',
          'green-light': '#4AE076',
          dark: '#1A1F2E',
          cream: '#FBFAF1',
          accent: '#3CD567',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
