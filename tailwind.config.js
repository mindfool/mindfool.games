/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B9BD1',
          light: '#A8C5E0',
          dark: '#4A7BA7',
        },
        calm: '#4CAF50',
        neutral: '#FFA726',
        scattered: '#EF5350',
        background: {
          light: '#F5F7FA',
          medium: '#E8EDF2',
        },
        text: {
          primary: '#2C3E50',
          secondary: '#5A6C7D',
        },
        divider: '#E0E7ED',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '38px', fontWeight: '700' }],
        'display-md': ['24px', { lineHeight: '30px', fontWeight: '600' }],
        'heading-1': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'heading-2': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'body-sm': ['12px', { lineHeight: '18px' }],
        'label': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [],
}
