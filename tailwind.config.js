/** @type {import ('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [required("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#D7FEFA",
                secondary: "#2B2E2E",
                tertiary: "#1A1D1D",
                custom:"#FFFFFF",

            }
        },
    },
    plugins: [],
}