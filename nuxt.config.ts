// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { 'http-equiv': 'X-Frame-Options', content: 'ALLOWALL' },
        { name: 'Content-Security-Policy', content: "frame-ancestors 'self' https://*.myshopify.com" },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  plugins: [
    { src: '~/plugins/vue-draggable-next.client.js' }
  ],
  build: {
    transpile: ["@ownego/polaris-vue"],
  },
  typescript: {
    typeCheck: false
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
