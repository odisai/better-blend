# Why am I getting a 403 Forbidden error from Spotify API?

## Error
```
Failed to Load Data
Spotify API access forbidden. This usually means the required permissions (scopes) are missing.
on installHook.js:1 << mutation #4 blend.fetchSessionData
```

## Setup
- Next.js + tRPC + NextAuth.js
- Spotify OAuth with scopes: `user-read-email`, `user-top-read`, `playlist-modify-public`, `playlist-modify-private`, `playlist-read-private`
- Error occurs when `blend.fetchSessionData` mutation tries to fetch top tracks/artists for both users

## What I've implemented
- ✅ 403 error handling in `spotifyApiRequest()`
- ✅ Scope verification that checks stored scopes
- ✅ Scope preservation during token refresh
- ✅ Verified redirect URI in Spotify Dashboard

## Questions
1. How can I verify that scopes are actually being stored in the database `Account.scope` field?
2. Could this happen if users authenticated before all scopes were added to the config?
3. The mutation fetches data for both users - how can I identify which user is causing the 403?
4. What's the best way to get more detailed error info from Spotify's API response?
5. Should I force re-authentication if scopes are missing, or handle it differently?

## What I need help with
- How to debug which specific endpoint/user is failing
- Best practices for handling missing scopes
- Whether there are Spotify Dashboard settings I'm missing
- How to verify scope storage and token refresh behavior

