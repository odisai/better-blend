# Diagnostic Prompt: Spotify API 403 Forbidden Error

## Problem Description

I'm experiencing a 403 Forbidden error when calling the `blend.fetchSessionData` mutation in my Next.js application using tRPC. The error occurs in the browser console and displays:

```
Failed to Load Data

Spotify API access forbidden. This usually means the required permissions (scopes) are missing.

on installHook.js:1  << mutation #4 blend.fetchSessionData
```

## Context

**Application Stack:**
- Next.js with tRPC
- NextAuth.js with PrismaAdapter for Spotify OAuth
- Spotify Web API

**What the mutation does:**
The `fetchSessionData` mutation attempts to fetch Spotify data for both users in a blend session:
- Top tracks for creator and partner (`/me/top/tracks`)
- Top artists for creator and partner (`/me/top/artists`)
- Audio features for tracks (`/audio-features`)

**Error Location:**
The error occurs when the mutation calls `spotifyApiRequest()` which makes authenticated requests to the Spotify API.

## Current Implementation

**OAuth Configuration:**
- Using NextAuth's SpotifyProvider
- Requesting scopes: `user-read-email`, `user-top-read`, `playlist-modify-public`, `playlist-modify-private`, `playlist-read-private`
- Using Authorization Code Flow (via NextAuth)

**Error Handling:**
- Added specific 403 error handling in `spotifyApiRequest()`
- Added scope verification that checks stored scopes against required scopes
- Token refresh logic preserves scope field

**Database:**
- Using Prisma with PostgreSQL
- Account model stores `scope` field (space-separated string)
- Scopes are stored automatically by NextAuth PrismaAdapter

## Questions

1. **Scope Storage:** When users authenticate, are the scopes being properly stored in the `Account.scope` field? How can I verify this?

2. **Token Refresh:** When tokens are refreshed, are the scopes preserved? I've added explicit scope preservation, but could there be edge cases?

3. **User Authentication State:** Could this be happening because:
   - Users authenticated before all scopes were added to the config?
   - Users denied some permissions during OAuth consent?
   - The stored scopes don't match what was actually granted?

4. **Spotify Dashboard:** Are there any settings in the Spotify Developer Dashboard that could cause this, beyond the redirect URI configuration?

5. **Multiple Users:** The mutation fetches data for both creator and partner. Could one user have proper scopes while the other doesn't? How would I identify which user is causing the 403?

6. **API Endpoint Specificity:** The error message doesn't specify which endpoint failed. Is there a way to get more detailed error information from Spotify's API response?

## What I've Tried

- ✅ Added 403 error handling with clear messages
- ✅ Added scope verification logging
- ✅ Ensured scope preservation during token refresh
- ✅ Verified redirect URI matches in Spotify Dashboard
- ✅ Confirmed all required scopes are requested in OAuth config

## Additional Information Needed

To help diagnose this issue, I would need to know:

1. **Server Logs:** What do the server-side logs show? Are there any warnings about missing scopes?
2. **Database State:** What scopes are actually stored in the `Account.scope` field for the affected users?
3. **Network Tab:** What's the exact Spotify API endpoint that's returning 403? What's the full error response body?
4. **User Flow:** Does this happen for:
   - New users on first authentication?
   - Existing users after token refresh?
   - Both users in a session, or just one?
5. **Spotify API Response:** What's the exact error message/body returned by Spotify's API?

## Potential Solutions to Explore

1. **Force Re-authentication:** Should users be prompted to re-authenticate if scopes are missing?
2. **Scope Validation:** Should we validate scopes before attempting API calls and show a user-friendly error?
3. **Error Context:** Can we add more context to the error message (which user, which endpoint)?
4. **Graceful Degradation:** Should we handle partial scope failures differently?

---

**Environment:**
- Development/Production: [specify]
- Node version: [specify]
- Next.js version: [specify]
- NextAuth version: [specify]

