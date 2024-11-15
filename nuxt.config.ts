// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  plugins: [
    { src: '~/plugins/vue-draggable-next.client.js' }
  ],
  build: {
    transpile: ["@ownego/polaris-vue"],
  },
  typescript: {
    typeCheck: true
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pages: true,
  ssr: false
})
