import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
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
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id ?? token?.sub ?? "unknown",
        },
      };
    },
    async signIn() {
      // Allow sign-in to proceed - we'll update spotifyId after user is created by adapter
      return true;
    },
    async jwt({ token, account, user }) {
      // Update Spotify ID after user is created by adapter
      // This only runs on sign-in when both account and user are available
      if (account?.provider === "spotify" && account.providerAccountId && user?.id) {
        try {
          await db.user.update({
            where: { id: user.id },
            data: { spotifyId: account.providerAccountId },
          });
        } catch (error) {
          // User might not exist yet - this should be rare but we handle it gracefully
          // The adapter should have created the user by this point
          console.error("Failed to update spotifyId:", error);
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
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
          // Explicitly set redirect URI for local development
          // Ensures it uses http://127.0.0.1:3000 instead of localhost
          redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/spotify`,
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  debug: env.NODE_ENV === "development",
};
