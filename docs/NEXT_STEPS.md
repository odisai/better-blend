# Next Implementation Steps

## Step 1: Foundation - BlendSession & Spotify Auth (Current Step)

### 1.1 Update Prisma Schema
- Add `BlendSession` model with all required fields
- Add `spotifyId` field to User model
- Add relationships between User and BlendSession

### 1.2 Configure Spotify OAuth
- Replace Discord provider with Spotify provider
- Add required Spotify scopes
- Update environment variables

### 1.3 Install Dependencies
- Install `nanoid` for unique code generation
- Install Spotify Web API client (optional, can use fetch)

### 1.4 Create Session Router
- Create `src/server/api/routers/session.ts`
- Implement `create` procedure (create session, generate code)
- Implement `join` procedure (join by code)
- Implement `get` procedure (get session details)
- Add to root router

### 1.5 Create Basic UI Flow
- Create `/create` page (trigger session creation)
- Create `/join/[code]` page (join session)
- Add basic loading states

**Estimated Time:** 2-3 hours

**Success Criteria:**
- ✅ Can create a blend session and get a code
- ✅ Can join a session with a code
- ✅ Session data persists in database
- ✅ Spotify OAuth works

---

## Step 2: Spotify Data Collection

### 2.1 Create Spotify Router
- Create `src/server/api/routers/spotify.ts`
- Implement `getTopTracks` (with time range)
- Implement `getTopArtists` (with time range)
- Implement `getAudioFeatures` (batch fetch)

### 2.2 Update Session Router
- Add `fetchSessionData` procedure
- Cache Spotify data in BlendSession
- Handle rate limiting

**Estimated Time:** 2-3 hours

---

## Step 3: Insights Dashboard

### 3.1 Create Blend Router
- Create `src/server/api/routers/blend.ts`
- Implement `calculateInsights` procedure
- Compatibility score algorithm
- Shared artists finder
- Audio features comparison

### 3.2 Build Insights UI
- Create `/blend/[sessionId]/insights` page
- Compatibility score display
- Shared artists grid
- Audio features chart (Recharts)

**Estimated Time:** 3-4 hours

---

## Step 4: Customization & Playlist Generation

### 4.1 Update Session Router
- Add `updateConfig` procedure
- Handle ratio, timeRange, playlistLength

### 4.2 Implement Blend Algorithm
- Track distribution by ratio
- Duplicate removal
- Interleaving logic

### 4.3 Playlist Creation
- Create playlists on Spotify
- Add tracks to playlists
- Update session with playlist URLs

**Estimated Time:** 3-4 hours

---

## Step 5: Sharing & Polish

### 5.1 Stats Card Generation
- Install `html-to-image`
- Create shareable card component
- Download functionality

### 5.2 Success Page
- Celebration UI
- Playlist links
- Share buttons

### 5.3 Error Handling & Edge Cases
- Session expiration handling
- Token refresh logic
- Error boundaries

**Estimated Time:** 2-3 hours

---

## Total MVP Timeline: 12-17 hours

