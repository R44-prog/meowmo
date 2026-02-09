/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                midnight: '#121212',
                surface: '#1A1A1A',
                background: '#121212',
                accent: '#F5E6D3',
                amber: {
                    light: '#F59E0B',
                    DEFAULT: '#D97706',
                    dark: '#B45309',
                },
                success: '#82E0AA',
                neutral: '#5D6D7E',
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
    safelist: [
        {
            pattern: /(bg|text)-(purple|blue|green|orange|emerald|red|indigo)-(100|400|500|600|700)/,
        },
        {
            pattern: /(from|to)-(purple|blue|green|orange|emerald|red|indigo)-(400|500|600)/,
        }
    ],
}
