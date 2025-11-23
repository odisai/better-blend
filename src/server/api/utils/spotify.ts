import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

/**
 * Required Spotify scopes for the application
 */
const REQUIRED_SCOPES = [
  "user-read-email",
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
];

/**
 * Get Spotify access token for a user
 * Handles token refresh if needed
 */
export async function getSpotifyAccessToken(userId: string): Promise<string> {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "spotify",
    },
  });

  if (!account) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Spotify account not found. Please sign in again.",
    });
  }

  // Check if stored scopes match required scopes
  if (account.scope) {
    const storedScopes = account.scope.split(" ");
    const missingScopes = REQUIRED_SCOPES.filter(
      (scope) => !storedScopes.includes(scope),
    );
    if (missingScopes.length > 0) {
      console.warn(
        `[Spotify] User ${userId} missing scopes: ${missingScopes.join(", ")}`,
      );
    }
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = account.expires_at ?? 0;

  if (expiresAt && now >= expiresAt - 300) {
    // Token expired or expiring soon, refresh it
    if (!account.refresh_token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Refresh token not available. Please sign in again.",
      });
    }

    try {
      const refreshedToken = await refreshSpotifyToken(account.refresh_token);
      
      // Update account with new token
      await db.account.update({
        where: { id: account.id },
        data: {
          access_token: refreshedToken.access_token,
          expires_at: Math.floor(Date.now() / 1000) + refreshedToken.expires_in,
          refresh_token: refreshedToken.refresh_token ?? account.refresh_token,
        },
      });

      return refreshedToken.access_token;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to refresh Spotify token. Please sign in again.",
      });
    }
  }

  if (!account.access_token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Access token not available. Please sign in again.",
    });
  }

  return account.access_token;
}

/**
 * Refresh Spotify access token
 */
async function refreshSpotifyToken(refreshToken: string) {
  const { env } = await import("@/env");
  
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
}

/**
 * Make authenticated Spotify API request
 */
export async function spotifyApiRequest<T>(
  userId: string,
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = await getSpotifyAccessToken(userId);
  
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Spotify authentication expired. Please sign in again.",
    });
  }

  if (response.status === 403) {
    let errorMessage = "Spotify API access forbidden. This usually means the required permissions (scopes) are missing.";
    try {
      const errorData = await response.json() as { error?: { message?: string; status?: number } };
      if (errorData.error?.message) {
        errorMessage = `Spotify API error: ${errorData.error.message}. Please sign in again to grant the required permissions.`;
      }
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new TRPCError({
      code: "FORBIDDEN",
      message: errorMessage,
    });
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limited. Please try again in ${retryAfter ?? "60"} seconds.`,
    });
  }

  if (!response.ok) {
    const error = await response.text();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Spotify API error: ${error}`,
    });
  }

  return response.json() as Promise<T>;
}

