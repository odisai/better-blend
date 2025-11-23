# Vercel Deployment Investigation - Spotify 403 Error

## Deployment Analysis

### Project Information
- **Project ID**: `prj_Ov1zC8d7mUHuS47JVjVjKABVouKs`
- **Project Name**: `better-blend`
- **Framework**: Next.js
- **Node Version**: 22.x
- **Latest Deployment**: `dpl_7TP4kHJ3TJAMh79LdvUDZaaG2Tin`
- **Status**: READY ✅
- **URL**: `better-blend.vercel.app`

### Key Deployments Related to Spotify Scope Issues

1. **`dpl_jwZK7TR33Wwfn3QFJoy8q3sdLFTR`** (Jan 2025)
   - Commit: `687659a2f9584b82c61eaabe851ec77f539a94b3`
   - Message: "fix(spotify): add 403 error handling and scope verification"
   - **This was the first fix attempt** - Added 403 error handling and scope verification
   - Build: ✅ Successful

2. **`dpl_A1YVDRxsk9hQBYUw5YdrQxJkgr1k`** (Jan 2025)
   - Commit: `8ceee6cd4dd8797c05e523a3980ad5dd89d21003`
   - Message: "fix(spotify): preserve scope field during token refresh"
   - **Second fix** - Explicitly preserve scope during token refresh
   - Build: ✅ Successful

3. **`dpl_7TP4kHJ3TJAMh79LdvUDZaaG2Tin`** (Latest - Jan 2025)
   - Commit: `255a791b7f3781e63082188ad4c9ef3c527a4d0b`
   - Message: Mobile responsiveness fixes
   - Build: ✅ Successful

## Build Log Analysis

### Recent Build Logs Show:
- ✅ All builds compile successfully
- ✅ No TypeScript errors
- ✅ Prisma generates correctly
- ⚠️ Minor React Hook warnings (non-blocking)

### Build Process:
1. Dependencies install correctly (752 packages)
2. Prisma Client generates successfully
3. Next.js build completes without errors
4. Type checking passes

## Root Cause Analysis

Based on the deployment history and code changes:

### Timeline of Issue:
1. **Initial Problem**: Users were getting 403 errors when calling Spotify API
2. **First Fix Attempt** (`dpl_jwZK7TR33Wwfn3QFJoy8q3sdLFTR`):
   - Added 403 error handling
   - Added scope verification (but only warnings, not blocking)
   - **Issue**: Scopes were checked but not enforced before API calls

3. **Second Fix Attempt** (`dpl_A1YVDRxsk9hQBYUw5YdrQxJkgr1k`):
   - Preserved scope field during token refresh
   - **Issue**: Still didn't validate scopes before making API calls

4. **Current Fix** (This session):
   - Added `validateSpotifyScopes()` that **blocks** API calls if scopes are missing
   - Enhanced error messages to identify which user is failing
   - Added diagnostic endpoint

### Why Users Are Still Getting 403 Errors:

1. **Users Authenticated Before Scope Fixes**
   - Users who signed in before the scope fixes were deployed may have:
     - Empty `scope` field in database
     - Missing required scopes
     - Tokens without proper permissions

2. **Scope Field Not Stored Initially**
   - NextAuth PrismaAdapter should store scopes automatically
   - But if users authenticated before scopes were properly configured, the field might be null/empty

3. **Token Refresh Doesn't Add Scopes**
   - When tokens are refreshed, Spotify doesn't return scopes
   - Scopes are preserved from original authorization
   - If original authorization didn't have scopes, refresh won't add them

## Production vs Development Differences

### Potential Issues:
1. **Environment Variables**:
   - Check that `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set correctly in Vercel
   - Check that `NEXTAUTH_URL` matches the production domain
   - Check that `NEXTAUTH_SECRET` is set

2. **Redirect URI Configuration**:
   - Spotify Dashboard must have the correct redirect URI:
     - Production: `https://better-blend.vercel.app/api/auth/callback/spotify`
   - The code explicitly sets redirect_uri, but verify Spotify Dashboard settings

3. **Database State**:
   - Production database may have users with missing/incomplete scopes
   - These users need to re-authenticate

## Recommendations

### Immediate Actions:
1. ✅ **Code Fixes Applied** (in this session):
   - Pre-request scope validation
   - Better error messages
   - Diagnostic endpoint

2. **Deploy and Test**:
   - Deploy the new fixes to production
   - Test with a new user (should work)
   - Test with an existing user (may need to re-authenticate)

3. **Monitor Logs**:
   - Check Vercel function logs for the detailed error messages
   - Look for `[Spotify 403]` log entries to identify problematic users
   - Use the diagnostic endpoint to check scope status

### Long-term Solutions:
1. **User Re-authentication Flow**:
   - Add UI that detects missing scopes
   - Prompt users to re-authenticate if scopes are missing
   - Use the `checkScopeStatus` endpoint to check before critical operations

2. **Database Migration**:
   - Query database to find users with missing scopes
   - Send them a notification to re-authenticate
   - Or force re-authentication on next login

3. **Monitoring**:
   - Set up alerts for 403 errors
   - Track scope-related errors
   - Monitor authentication success rates

## Next Steps

1. **Deploy Current Fixes**:
   ```bash
   git add .
   git commit -m "fix(spotify): add pre-request scope validation and enhanced error handling"
   git push
   ```

2. **Verify Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Verify all required variables are set

3. **Test in Production**:
   - Try creating a blend with a new user
   - Try with an existing user
   - Check server logs for detailed error messages

4. **Check Spotify Dashboard**:
   - Verify redirect URIs are correct
   - Verify app has all required scopes configured
   - Check app status and quota

## Diagnostic Tools Available

1. **Server Logs**: Check Vercel function logs for detailed error messages
2. **Diagnostic Endpoint**: `api.spotify.checkScopeStatus.useQuery()` to check scope status
3. **Database Query**: Check `Account` table for scope field values

## Environment Variables to Verify

In Vercel Dashboard, ensure these are set:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (should be `https://better-blend.vercel.app`)
- `DATABASE_URL`

