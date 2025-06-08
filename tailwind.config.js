// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}" // 👈 Escanea tus archivos Angular
  ],
  theme: {
    extend: {
      animation: {
        gradientMove: 'gradientMove 15s ease infinite',
        fadeIn: 'fadeIn 0.5s ease-out', // 👈 Agregamos fadeIn
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
