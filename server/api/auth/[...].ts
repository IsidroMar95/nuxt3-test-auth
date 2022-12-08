import {NuxtAuthHandler} from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";

const config = useRuntimeConfig()

export default NuxtAuthHandler({
  secret: config.NUXT_SECRET,
  pages: {
    signIn: '/login'
  },
  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        console.log('starting auth', credentials, config.API_BASE_URL)
        const response: any = await $fetch(
          `${config.API_BASE_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.username,
              password: credentials.password,
            }),
          }
        );
        console.log('laravel response', response)
        if (response.status === 'success') {
          return response.data;
        } else {
          return null
        }
      },
    }),
  ]
});
