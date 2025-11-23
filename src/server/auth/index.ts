import "server-only";

import { type Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./config";
import { env } from "@/env";

/**
 * Get the current session in App Router (Next.js 15+)
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const auth = async (): Promise<Session | null> => {
  // Bypass auth in development
  if (env.NODE_ENV === "development") {
    return {
      user: {
        id: "dev-user-id",
        name: "Dev User",
        email: "dev@example.com",
        image: null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };
  }

  return await getServerSession(authOptions);
};

export { authOptions };
