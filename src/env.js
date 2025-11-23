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
    // AUTH_URL is optional when trustHost: true is set in auth config
    // NextAuth v5 can infer the URL from request headers when trustHost is enabled
    // However, setting it explicitly can help avoid "Invalid URL" errors in some edge cases
    // See: https://authjs.dev/reference/nextjs#environment-variable-inference
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
    // AUTH_URL handling with trustHost: true support
    // With trustHost: true, NextAuth v5 can infer URL from headers, so AUTH_URL is optional
    // However, we provide fallbacks for convenience and to avoid edge cases
    // See Reddit discussion: https://www.reddit.com/r/nextjs/comments/.../
    AUTH_URL: (() => {
      // If explicitly set, use it (but ensure no trailing slash)
      if (process.env.AUTH_URL) {
        const url = process.env.AUTH_URL.trim().replace(/\/$/, "");
        // Only set if it's different to avoid unnecessary writes
        if (url !== process.env.AUTH_URL) {
          process.env.AUTH_URL = url;
        }
        return url;
      }

      // Vercel provides VERCEL_URL (without protocol)
      // Only set if we have a valid VERCEL_URL to avoid "Invalid URL" errors
      if (process.env.VERCEL_URL) {
        const vercelUrl = `https://${process.env.VERCEL_URL}`.replace(
          /\/$/,
          "",
        );
        process.env.AUTH_URL = vercelUrl;
        return vercelUrl;
      }

      // Development fallback - helpful for local development
      if (process.env.NODE_ENV === "development") {
        const localhostUrl = "http://localhost:3000";
        // Only set in dev for convenience, but trustHost will handle it anyway
        process.env.AUTH_URL = localhostUrl;
        return localhostUrl;
      }

      // In production with trustHost: true, NextAuth can infer from headers
      // Return undefined to let NextAuth handle it via trustHost
      // This matches the Reddit solution of removing AUTH_URL entirely
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
