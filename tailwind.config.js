/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./pages/index.vue",
      "./pages/collection/[id]/vm.vue",
      "./components/layout.vue",
      "./components/productCard.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

