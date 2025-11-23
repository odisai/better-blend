# Spotify API 403 Forbidden Error - Root Cause Analysis & Fix

## Problem Summary

After creating a blend and attempting to fetch Spotify data via `blend.fetchSessionData`, users encounter a 403 Forbidden error with the message:

> "Spotify API access forbidden. This usually means the required permissions (scopes) are missing."

## Root Causes Identified

### 1. **Users Authenticated Before All Scopes Were Added**
   - If users signed in before all required scopes were added to the NextAuth configuration, their `Account.scope` field in the database may be empty or missing scopes
   - NextAuth PrismaAdapter stores scopes from the OAuth token response, but if scopes weren't requested initially, they won't be stored

### 2. **Scope Field Not Properly Stored**
   - The `Account.scope` field in the database might be `null` or empty string
   - This can happen if:
     - The OAuth provider didn't return scopes in the token response
     - There was an issue during the initial authentication flow
     - Users authenticated via an older version of the app

### 3. **No Pre-Request Validation**
   - Previously, scopes were only checked with a warning, not validated before API calls
   - This meant 403 errors occurred at the Spotify API level rather than being caught early

### 4. **Poor Error Messages**
   - When a 403 occurred, it wasn't clear which user (creator or partner) was failing
   - The mutation fetches data for both users in parallel, making it hard to identify the problematic user
   - Error messages didn't indicate which specific scopes were missing

## Solution Implemented

### 1. **Pre-Request Scope Validation** (`validateSpotifyScopes`)
   - Added a new function that validates scopes **before** making any Spotify API calls
   - Throws a clear error if:
     - No scopes are stored in the database
     - Required scopes are missing
   - Provides helpful error messages telling users to sign out and sign in again

### 2. **Enhanced Error Logging**
   - Added detailed logging that includes:
     - User ID and name/email
     - The specific endpoint being called
     - Stored scopes vs. required scopes
     - Full Spotify API error response
   - This makes it easy to identify which user is causing the issue

### 3. **Improved Error Handling in `fetchSessionData`**
   - Wrapped each API call with individual error handlers
   - Errors now clearly indicate whether it's the creator or partner failing
   - Each error includes context about which specific operation failed

### 4. **Diagnostic Endpoint**
   - Added `spotify.checkScopeStatus` query endpoint
   - Allows checking scope status for debugging
   - Returns:
     - Whether account exists
     - Whether scopes are stored
     - List of stored scopes
     - List of missing scopes
     - User name/email

## Required Scopes

The application requires these Spotify scopes:
- `user-read-email` - Read user's email
- `user-top-read` - Read user's top tracks and artists
- `playlist-modify-public` - Create/modify public playlists
- `playlist-modify-private` - Create/modify private playlists
- `playlist-read-private` - Read user's private playlists

## How to Debug

### 1. Check Server Logs
When a 403 occurs, check the server logs for:
```
[Spotify 403] User: <userId> (<userName>), Endpoint: <endpoint>, Details: <details>, Stored Scopes: <scopes>
```

### 2. Use Diagnostic Endpoint
Call `api.spotify.checkScopeStatus.useQuery()` in your frontend to check scope status:
```typescript
const { data } = api.spotify.checkScopeStatus.useQuery();
console.log('Scope status:', data);
```

### 3. Check Database Directly
Query the `Account` table to see stored scopes:
```sql
SELECT userId, scope, providerAccountId 
FROM Account 
WHERE provider = 'spotify';
```

## How to Fix for Existing Users

### Option 1: Force Re-authentication (Recommended)
Users with missing scopes need to:
1. Sign out
2. Sign in again
3. Grant all required permissions during OAuth flow

### Option 2: Manual Database Update (Not Recommended)
You could manually update scopes in the database, but this won't actually grant the permissions - the access token still won't have those scopes. Users must re-authenticate.

## Prevention

1. **Always validate scopes before API calls** - The new `validateSpotifyScopes` function ensures this
2. **Monitor scope warnings** - Check server logs for scope mismatch warnings
3. **Test with new users** - Verify that new authentications properly store all scopes
4. **Handle scope changes gracefully** - If you add new scopes, existing users will need to re-authenticate

## Testing

To test the fix:

1. **Test with a user missing scopes:**
   - Create a test user account
   - Manually set `Account.scope` to `null` or remove some scopes
   - Attempt to call `blend.fetchSessionData`
   - Should get a clear error message before the API call

2. **Test with valid user:**
   - Ensure user has all required scopes
   - Call `blend.fetchSessionData`
   - Should succeed

3. **Test diagnostic endpoint:**
   - Call `api.spotify.checkScopeStatus.useQuery()`
   - Verify it returns correct scope status

## Files Modified

1. `src/server/api/utils/spotify.ts`
   - Added `validateSpotifyScopes()` function
   - Enhanced `spotifyApiRequest()` with scope validation and better error logging
   - Added `getSpotifyScopeStatus()` diagnostic function
   - Exported `REQUIRED_SCOPES` constant

2. `src/server/api/routers/blend.ts`
   - Improved error handling in `fetchSessionData` mutation
   - Added per-user error catching and reporting

3. `src/server/api/routers/spotify.ts`
   - Added `checkScopeStatus` query endpoint for debugging

## Next Steps

1. Monitor server logs for scope-related errors
2. Consider adding a UI component that checks scope status and prompts users to re-authenticate if needed
3. Add automated tests for scope validation
4. Consider adding a migration script to identify users with missing scopes

