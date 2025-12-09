/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        'grid': 'var(--grid-color)',
        'text': 'var(--text-color)',
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
      },
      fontFamily: {
        display: ['var(--font-jura)', 'sans-serif'],
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
