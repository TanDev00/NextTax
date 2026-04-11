/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      // Bạn có thể định nghĩa các màu sắc, font chữ tùy chỉnh ở đây
    },
  },
  plugins: [],
};
