import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { db } from "@/server/db";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  // trustHost allows NextAuth to infer the URL from request headers
  // With trustHost: true, AUTH_URL becomes optional - NextAuth will infer it from headers
  // This is the recommended approach for NextAuth v5 (see: https://authjs.dev/reference/nextjs#environment-variable-inference)
  // Setting AUTH_URL explicitly is still supported but not required
  trustHost: true,
  // Note: basePath is not a valid NextAuth v5 option - the base path is automatically inferred
  // from the route structure (/api/auth/[...nextauth])
  providers: [
    SpotifyProvider({
      // SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required by env schema (z.string())
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clientId: env.SPOTIFY_CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "user-read-email",
            "user-top-read",
            "playlist-modify-public",
            "playlist-modify-private",
            "playlist-read-private",
          ].join(" "),
        },
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    async signIn({ user, account }) {
      // Store Spotify ID when user signs in
      if (account?.provider === "spotify" && account.providerAccountId) {
        await db.user.update({
          where: { id: user.id },
          data: { spotifyId: account.providerAccountId },
        });
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
