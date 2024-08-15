// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/kinde', '@nuxtjs/tailwindcss'],

  build: {
    transpile: ['trpc-nuxt']
  },

  typescript: {
    shim: false
  },

  devtools: {
    timeline: {
      enabled: true
    }
  },

  css: ['~/assets/css/input.css']
})
