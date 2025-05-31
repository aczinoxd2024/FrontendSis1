// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}" // 👈 Asegura que Tailwind escanee tus archivos Angular
  ],
  theme: {
    extend: {
      animation: {
        gradientMove: 'gradientMove 15s ease infinite',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
