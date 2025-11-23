import "server-only";

import { type Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./config";

/**
 * Get the current session in App Router (Next.js 15+)
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const auth = async (): Promise<Session | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await getServerSession(authOptions);
};

export { authOptions };
