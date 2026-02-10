/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0ea5e9', // Sky 500
                    dark: '#0284c7', // Sky 600
                    light: '#e0f2fe', // Sky 100
                },
                secondary: {
                    DEFAULT: '#10b981', // Emerald 500
                    dark: '#059669', // Emerald 600
                }
            }
        },
    },
    plugins: [],
}
