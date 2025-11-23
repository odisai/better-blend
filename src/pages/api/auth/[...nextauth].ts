import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from "@/server/auth/config";
import { env } from "@/env";

const handler = NextAuth(authOptions);

// Wrap the handler to bypass auth in development
export default async function authHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // In development, intercept session requests and return mock session
  if (
    env.NODE_ENV === "development" &&
    req.method === "GET" &&
    req.query.nextauth?.[0] === "session"
  ) {
    const mockSession = {
      user: {
        id: "dev-user-id",
        name: "Dev User",
        email: "dev@example.com",
        image: null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    return res.status(200).json(mockSession);
  }

  return handler(req, res);
}
