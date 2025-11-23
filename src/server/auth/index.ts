import "server-only";

import { type Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./config";

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (): Promise<Session | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await getServerSession(authOptions);
};

/**
 * Get the current session in App Router (Next.js 15+)
 */
export const auth = async (): Promise<Session | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await getServerSession(authOptions);
};

export { authOptions };
