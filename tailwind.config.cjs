/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'radial-dot':
                    'radial-gradient(rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 15% , rgba(0,0,0,0) 50%)',
            },
        },
    },
    plugins: [],
}
