import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from "@/server/auth/config";
import { env } from "@/env";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export default async function authHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Log OAuth callback errors for debugging
  if (
    req.query.nextauth?.[0] === "callback" &&
    req.query.nextauth?.[1] === "spotify"
  ) {
    if (req.query.error) {
      console.error("[NextAuth] OAuth callback error:", {
        error: req.query.error,
        error_description: req.query.error_description,
        url: req.url,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return handler(req, res);
}
