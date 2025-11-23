import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // AUTH_SECRET is required in production, but NextAuth v5 beta often requires it in development too
    // If you get "server configuration" errors, try setting AUTH_SECRET even in development
    // Generate with: openssl rand -base64 32
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    // AUTH_URL is used by NextAuth to construct callback URLs
    // If not set, NextAuth will try to infer from headers (trustHost: true)
    // Fallback logic in runtimeEnv handles Vercel deployments and localhost
    // NOTE: In production, AUTH_URL should be explicitly set to avoid "Invalid URL" errors
    AUTH_URL: z.string().url().optional(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    // Fallback to Vercel URL or localhost if AUTH_URL is not set
    // NextAuth v5 reads AUTH_URL from process.env, so we set it here if missing
    // IMPORTANT: AUTH_URL must always be a valid URL or NextAuth v5 will throw "Invalid URL" error
    AUTH_URL: (() => {
      // Check for explicit AUTH_URL first
      if (process.env.AUTH_URL) {
        return process.env.AUTH_URL;
      }

      // Vercel provides VERCEL_URL (without protocol) or VERCEL_BRANCH_URL
      if (process.env.VERCEL_URL) {
        const vercelUrl = `https://${process.env.VERCEL_URL}`;
        process.env.AUTH_URL = vercelUrl;
        return vercelUrl;
      }

      // Development fallback
      if (process.env.NODE_ENV === "development") {
        const localhostUrl = "http://localhost:3000";
        process.env.AUTH_URL = localhostUrl;
        return localhostUrl;
      }

      // Production without VERCEL_URL - this will cause an error
      // User must set AUTH_URL explicitly in Vercel environment variables
      // Return undefined to trigger validation error with helpful message
      if (process.env.NODE_ENV === "production") {
        console.error(
          "❌ AUTH_URL is required in production. Please set it in Vercel environment variables:\n" +
            "   AUTH_URL=https://your-app.vercel.app",
        );
      }

      return undefined;
    })(),
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
