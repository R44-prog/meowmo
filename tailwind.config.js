/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FDFCF8',
                accent: '#5D6D7E',
                success: '#82E0AA',
                neutral: '#D5DBDB',
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
