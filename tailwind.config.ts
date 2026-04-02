import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jetson: {
          blue: '#1e40af',
          dark: '#0f172a',
          accent: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
export default config
