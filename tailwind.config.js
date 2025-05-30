/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include if using App Router
    ],
    theme: {
        extend: {
            colors: {
                // Your existing color palette, slightly restructured for clarity
                // You can expand these with more shades (e.g., 100, 200, ..., 900) if needed
                primary: {
                    DEFAULT: '#2196f3', // Your main primary blue
                    light: '#64b5f6',   // A lighter shade
                    dark: '#1976d2',    // Your darker shade
                },
                accent: {
                    DEFAULT: '#ffc107', // Your main accent yellow/amber
                    light: '#ffd54f',   // A lighter shade
                    dark: '#ffa000',    // A darker shade
                },
                background: {
                    DEFAULT: '#f9f9f9', // Main light background
                    alt: '#ffffff',     // Alternative background (e.g., for cards)
                    darker: '#f0f0f0',  // A slightly darker background variant
                },
                text: {
                    DEFAULT: '#333333', // Main dark text color
                    medium: '#555555',  // Medium emphasis text
                    light: '#777777',   // Light emphasis text
                    inverted: '#ffffff',// Text for dark backgrounds
                },
                // Common UI feedback colors
                success: {
                    DEFAULT: '#4caf50',
                    light: '#81c784',
                    dark: '#388e3c',
                },
                warning: {
                    DEFAULT: '#ff9800',
                    light: '#ffb74d',
                    dark: '#f57c00',
                },
                danger: {
                    DEFAULT: '#f44336',
                    light: '#e57373',
                    dark: '#d32f2f',
                },
                info: {
                    DEFAULT: '#03a9f4', // Similar to your primary, can be distinct
                    light: '#4fc3f7',
                    dark: '#0288d1',
                },
                // Border colors
                border: {
                    DEFAULT: '#e0e0e0', // Default border color
                    light: '#eeeeee',
                }
            },
            fontFamily: {
                // Add your custom fonts here
                // Example: Using system UI fonts as a good default
                sans: [
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    '"Noto Sans"',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
                // You could add a serif or mono stack if needed
                // serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
                // mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
            },
            // You can extend spacing, borderRadius, keyframes, animations, etc.
            spacing: {
                // Example: Add more specific spacing units if needed
                // '128': '32rem',
            },
            borderRadius: {
                // Example: Add custom border radius sizes
                // 'xl': '1rem', // Tailwind already has xl, this is for overwriting or adding more
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            // Default Next.js gradient, kept from your original
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            // Example for custom animations and keyframes
            // keyframes: {
            //   fadeIn: {
            //     '0%': { opacity: '0' },
            //     '100%': { opacity: '1' },
            //   },
            // },
            // animation: {
            //   fadeIn: 'fadeIn 0.5s ease-in-out',
            // },
        },
        // You can also define global container settings here
        // This centralizes padding for your .container class
        container: {
            center: true, // Horizontally centers the container
            padding: {
                DEFAULT: '1rem',  // Default padding
                sm: '1.5rem',     // Padding for small screens
                lg: '2rem',       // Padding for large screens
            },
            // You might want to set max-widths here too, or handle it with utility classes
            // screens: {
            //   sm: '640px',
            //   md: '768px',
            //   lg: '1024px',
            //   xl: '1280px',
            //   '2xl': '1536px',
            // }
        },
    },
    plugins: [
        // Add official Tailwind CSS plugins here if you need them
        // require('@tailwindcss/forms'),        // For better default form styling
        // require('@tailwindcss/typography'),   // For styling HTML generated from Markdown
        // require('@tailwindcss/aspect-ratio'), // For controlling aspect ratio of elements
        // require('@tailwindcss/line-clamp'), // For truncating text to a specific number of lines

        // Example of a custom plugin (if you were to write one)
        // function ({ addUtilities }) {
        //   const newUtilities = {
        //     '.text-shadow': {
        //       textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        //     },
        //   }
        //   addUtilities(newUtilities, ['responsive', 'hover'])
        // }
    ],
};