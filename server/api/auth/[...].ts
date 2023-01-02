import CredentialsProvider from "next-auth/providers/credentials";
import {NuxtAuthHandler} from "#auth";

const config = useRuntimeConfig()

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

export interface Token {
  accessToken: string;
  accessTokenExpires: string;
}

async function refreshAccessToken(refreshToken: Token) {
  try {
    console.warn("trying to post to refresh token");
    const refreshedTokens = await $fetch<{
      data: {
        access_token: string;
        expires_in: number;
      };
    } | null>(`${config.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        refresh_token: refreshToken.accessToken,
        mode: "json",
      },
    });

    if (!refreshedTokens || !refreshedTokens.data) {
      console.warn("No refreshed tokens");
      throw refreshedTokens;
    }

    console.warn("Refreshed tokens successfully");
    return {
      ...refreshToken,
      accessToken: refreshedTokens.data.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.data.expires_in,
    };
  } catch (error) {
    console.warn("Error refreshing token", error);
    return {
      ...refreshToken,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NuxtAuthHandler({
  secret: config.NUXT_SECRET,
  pages: {
    signIn: '/login'
  },

  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const payload = {
            email: credentials.email,
            password: credentials.password,
          };

          const userTokens = await $fetch<{
            data: { access_token: string; expires_in: number; };
          } | null>(`${config.API_BASE_URL}/auth/login`, {
            method: "POST",
            body: payload,
            headers: {
              "Content-Type": "application/json",
            },
          });

          const userDetails = await $fetch<{
            data: {
              id: string;
              email: string;
              roles: [],
              user_details: {}
            };
          } | null>(`${config.API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userTokens?.data?.access_token}`,
            },
          });

          if (!userTokens || !userTokens.data || !userDetails || !userDetails.data) {
            throw createError({
              statusCode: 500,
              statusMessage: "Next auth failed",
            });
          }

          const user = {
            id: userDetails.data.id,
            email: userDetails.data.email,
            details: userDetails.data.user_details,
            roles: userDetails.data.roles,
            accessToken: userTokens.data.access_token,
            accessTokenExpires: Date.now() + userTokens.data.expires_in,
            refreshToken: userTokens.data.access_token,
          };

          // const allowedRoles = [
          //   "53ed3a6a-b236-49aa-be72-f26e6e4857a0",
          //   "d9b59a92-e85d-43e2-8062-7a1242a8fce6",
          // ];
          //
          // // Only allow admins and sales
          // if (!allowedRoles.includes(user.role)) {
          //   throw createError({
          //     statusCode: 403,
          //     statusMessage: "Not allowed",
          //   });
          // }

          return user;
        } catch (error) {
          console.warn("Error logging in", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({token, user, account}) {
      if (account && user) {
        console.warn("JWT callback", {token, user, account});
        return {
          ...token,
          ...user,
        };
      }

      // Handle token refresh before it expires of 15 minutes
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        console.warn("Token is expired. Getting a new");
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({session, token}) {
      session.user = {
        ...session.user,
        ...token,
      };

      return session;
    },
  },
});
