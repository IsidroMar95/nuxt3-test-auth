// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {charset: "utf-8"},
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          hid: 'description',
          name: 'description',
          content: ''
        }
      ],
      title: 'Nuxt 3 - Auth',
      bodyAttrs: {
        class: 'bg-gray-50 transition-colors duration-100 antialiased overflow-y-auto h-full'
      },
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
    'nuxt-headlessui'
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  auth: {
    enableGlobalAppMiddleware: true
  },
  headlessui: {
    prefix: 'Headless'
  },
})
