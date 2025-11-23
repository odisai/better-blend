# BetterBlend Product Requirements Document

**Version:** 1.0 MVP

**Date:** November 22, 2025

---

## 1. Executive Summary

### 1.1 Product Vision

BetterBlend enhances Spotify's Blend feature for couples, providing deep music compatibility insights, customizable playlist generation, and shareable moments.

### 1.2 Problem Statement

Spotify Blend is limited: fixed 50/50 ratios, minimal insights, no customization options, and limited shareability for couples wanting to showcase their musical connection.

### 1.3 Solution

A web app enabling two Spotify users to:

- Analyze music compatibility with rich visualizations

- Customize blend ratios (30/70 to 70/30) and time periods

- Generate better playlists saved to both accounts

---

## 2. User Personas & Journey

### 2.1 Primary Persona

#### Sarah & Alex (Couple, 25-35)

- Active Spotify users who share music together

- Tech-savvy, social media active

- Want personalized playlists that reflect both tastes

- Enjoy discovering insights about their relationship

### 2.2 User Flow

```text
Landing → User A Login → Create Session (get code) → Share Code
                                                            ↓
Landing → User B Login → Join Session ← Click Shared Link
                                ↓
                        Insights Dashboard
                        (compatibility, shared artists, audio features)
                                ↓
                        Customize Blend
                        (ratio, time period, length)
                                ↓
                        Generate Playlist
                                ↓
                        Success + Share Card
```

---

## 3. Feature Requirements

### 3.1 MVP Features (Must Have)

#### Authentication & Sessions

- Spotify OAuth login (NextAuth.js)

- Create blend session with unique code (e.g., "LOVE123")

- Join session via shareable link

- Session expires in 24 hours

#### Data Collection

- Fetch top 50 tracks (3 time ranges: 4 weeks, 6 months, 1 year)

- Fetch top 50 artists (same time ranges)

- Fetch audio features (danceability, energy, valence, etc.)

- Cache data in database for performance

#### Insights Dashboard

- Music compatibility score (0-100%)

- Top 10 shared artists with album artwork

- Audio feature radar chart comparison

- Personality insights ("You're the energetic one!")

- Top shared tracks list

#### Customization Options

- Blend ratio slider (30/70 to 70/30)

- Time period selector (short/medium/long term)

- Playlist length selector (25, 50, 100 songs)

- Live preview of configuration

#### Playlist Generation

- Generate blended playlist using custom algorithm

- Create playlist on both Spotify accounts

- Interleave tracks for better distribution

- Remove duplicates automatically

#### Sharing

- Generate shareable stats card (image)

- Display compatibility score and top artists

- Downloadable PNG format

- Direct links to Spotify playlists

### 3.2 Phase 2 Features (Post-MVP)

- Persistent user accounts with login history

- Multiple blend sessions per user

- Blend history and evolution tracking

- Multiple algorithm options (discovery vs comfort zone)

- Artist/genre exclusion filters

- Recommendations to bridge taste gaps

- Advanced visualizations (Venn diagrams, timelines)

- Social features and viral growth mechanics

---

## 4. Technical Architecture

### 4.1 Tech Stack Overview

#### Framework & Language

- Next.js 14 (App Router)

- TypeScript (strict mode)

- React 18

#### T3 Stack Components

- **tRPC:** Type-safe API layer

- **Prisma:** ORM for database operations

- **NextAuth.js:** Authentication (Spotify OAuth)

- **TailwindCSS:** Styling framework

#### Additional Libraries

- shadcn/ui: UI component library

- Recharts: Data visualization

- Zod: Schema validation

- nanoid: Unique code generation

- html-to-image: Stats card generation

#### Infrastructure

- Vercel: Hosting and deployment

- Vercel Postgres: Database (PostgreSQL)

- Vercel KV (optional): Redis for session codes

### 4.2 System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │   Pages    │  │ Components │  │  tRPC Client   │   │
│  │ (Next.js)  │  │ (React/UI) │  │  (Type-safe)   │   │
│  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                    Server (Vercel)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                   │  │
│  │  ┌────────────┐  ┌──────────────────────────┐   │  │
│  │  │  NextAuth  │  │      tRPC Router         │   │  │
│  │  │   OAuth    │  │  ┌────────┬───────────┐  │   │  │
│  │  └────────────┘  │  │Session │ Spotify   │  │   │  │
│  │                  │  │Router  │ Router    │  │   │  │
│  │                  │  └────────┴───────────┘   │   │  │
│  │                  │  ┌────────────────────┐   │   │  │
│  │                  │  │   Blend Router     │   │   │  │
│  │                  │  └────────────────────┘   │   │  │
│  │                  └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Prisma ORM Layer                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Vercel Postgres (Database)                  │
│  ┌────────┐ ┌────────────┐ ┌─────────────────┐        │
│  │ Users  │ │  Accounts  │ │  BlendSessions  │        │
│  └────────┘ └────────────┘ └─────────────────┘        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│             External APIs                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Spotify Web API                        │   │
│  │  • OAuth 2.0 Authentication                      │   │
│  │  • GET /me/top/tracks                           │   │
│  │  • GET /me/top/artists                          │   │
│  │  • GET /audio-features                          │   │
│  │  • POST /users/{id}/playlists                   │   │
│  │  • POST /playlists/{id}/tracks                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Database Schema Overview

#### Core Tables

**Users** (NextAuth managed)

- Basic user info (id, name, email, image)

- spotifyId (unique Spotify user ID)

- Relationships to accounts and sessions

**Accounts** (NextAuth managed)

- OAuth provider details

- Access tokens and refresh tokens

- Token expiration tracking

**BlendSessions** (Custom)

- Session metadata (id, code, status, expiry)

- Creator and partner user references

- Cached Spotify data (tracks, artists, features)

- Configuration (ratio, timeRange, playlistLength)

- Generated playlist details

- Calculated insights (compatibility, shared artists)

#### Session States

- PENDING: Waiting for partner to join

- ACTIVE: Both users joined, viewing insights

- GENERATED: Playlist created successfully

- EXPIRED: Session past 24-hour limit

### 4.4 API Architecture (tRPC)

#### Three Main Routers

##### 1. Session Router

- `create`: Create new blend session, return code

- `join`: Join existing session by code

- `get`: Retrieve session details

- `updateConfig`: Update ratio/time range/length

##### 2. Spotify Router

- `getTopTracks`: Fetch user's top tracks

- `getTopArtists`: Fetch user's top artists

- `getAudioFeatures`: Batch fetch audio features

##### 3. Blend Router

- `fetchSessionData`: Cache both users' Spotify data

- `calculateInsights`: Compute compatibility and insights

- `generatePlaylist`: Create and save playlists

### 4.5 Core Algorithms

#### Compatibility Calculator

- Uses Jaccard similarity on shared artists

- Weights by artist popularity

- Outputs score 0-100%

#### Audio Features Comparison

- Averages 7 audio features per user

- Calculates differences (energy, valence, etc.)

- Generates personality insights

#### Blend Generator

- Distributes tracks by custom ratio

- Removes duplicate tracks

- Interleaves for better variety

- Limits to specified length

#### Shared Artists Finder

- Finds intersection of artist IDs

- Sorts by popularity

- Returns top 10 with full metadata

---

## 5. Data Flow

### 5.1 Session Creation Flow

1. User A clicks "Create Blend"

2. Authenticates via Spotify OAuth

3. Server creates BlendSession in database

4. Generates unique code (e.g., "LOVE-2024")

5. Returns shareable link to User A

6. User A shares link with User B

### 5.2 Session Join Flow

1. User B clicks shared link

2. Authenticates via Spotify OAuth

3. Server validates code and session status

4. Updates BlendSession with partnerId

5. Changes status to ACTIVE

6. Redirects both users to insights page

### 5.3 Insights Generation Flow

1. Frontend triggers `fetchSessionData` mutation

2. Server fetches both users' Spotify data in parallel:

    - Top 50 tracks with specified time range

    - Top 50 artists with specified time range

    - Audio features for all tracks

3. Caches data in BlendSession as JSON

4. Frontend triggers `calculateInsights` query

5. Server computes:

    - Compatibility score

    - Shared artists list

    - Audio feature comparisons

    - Personality insights

6. Caches insights in database

7. Returns to frontend for display

### 5.4 Playlist Generation Flow

1. User adjusts customization options

2. Frontend calls `updateConfig` mutation

3. User clicks "Generate Playlist"

4. Server runs blend algorithm:

    - Distributes tracks by ratio

    - Removes duplicates

    - Interleaves tracks

5. Creates playlist on User A's Spotify account

6. Adds tracks to User A's playlist

7. Creates identical playlist on User B's account

8. Adds tracks to User B's playlist

9. Updates BlendSession with playlist details

10. Returns success with playlist URLs

---

## 6. Security & Privacy

### 6.1 Authentication

- Spotify OAuth 2.0 with PKCE flow

- Access tokens stored in encrypted database

- Refresh tokens for seamless re-authentication

- JWT session tokens (httpOnly cookies)

### 6.2 Data Protection

- All API calls require authentication

- Users can only access their own blend sessions

- Session codes expire after 24 hours

- No sensitive data exposed in URLs

- HTTPS enforced (Vercel default)

### 6.3 Spotify API Scopes

- `user-read-email`: Basic profile info

- `user-top-read`: Top tracks and artists

- `playlist-modify-public`: Create playlists

- `playlist-modify-private`: Create private playlists

- `playlist-read-private`: Read user playlists

---

## 7. Performance Considerations

### 7.1 Optimization Strategies

- Cache Spotify data in database (avoid repeated API calls)

- Batch audio features requests (up to 100 tracks)

- Parallel data fetching (Promise.all)

- Client-side loading states

- Optimistic UI updates where possible

### 7.2 Rate Limiting

- Spotify API: 429 responses handled with retry logic

- Database queries: Prisma connection pooling

- Image generation: Server-side only

### 7.3 Expected Load Times

- Authentication: <2 seconds

- Data fetching: 3-5 seconds (both users)

- Insights calculation: <1 second (cached)

- Playlist generation: 5-8 seconds

- Total flow: <3 minutes

---

## 8. User Experience

### 8.1 Key UI Pages

#### Landing Page

- Hero with value proposition

- Feature highlights (3 cards)

- Example stats card preview

- "Create Your Blend" CTA

#### Create Session

- Loading animation while fetching data

- Success screen with shareable code/link

- Copy to clipboard functionality

- QR code for mobile sharing

#### Join Session

- Input code manually or auto-fill from URL

- Preview creator's profile

- "Join Blend" CTA

#### Insights Dashboard Page

- Large compatibility score (circular progress)

- Shared artists grid (2x5 with album art)

- Audio features radar chart

- Insight cards with personality traits

- "Customize Your Blend" CTA

#### Customize Page

- Side-by-side user profiles

- Interactive ratio slider

- Time period pills (visual selection)

- Playlist length selector

- Configuration summary

- "Generate Playlist" CTA

#### Success Page

- Celebration animation

- Playlist preview (first 10 tracks)

- Direct Spotify links

- Downloadable stats card

- Social share buttons

- "Create Another Blend" option

### 8.2 Design Principles

- Spotify-inspired dark theme with green accents

- Mobile-first responsive design

- Clear visual hierarchy

- Immediate feedback on all actions

- Error states with helpful messages

- Loading states for all async operations

---

## 9. MVP Timeline & Milestones

### Day 1: Build (8-10 hours)

#### Phase 1: Foundation (2 hours)

- Project setup with create-t3-app

- Database schema design

- Prisma migrations

- NextAuth configuration

#### Phase 2: Backend (3 hours)

- tRPC routers implementation

- Spotify API client

- Core algorithms (compatibility, blend generation)

- Authentication flow testing

#### Phase 3: Frontend (4 hours)

- Landing page and auth flows

- Insights dashboard UI

- Customization interface

- Playlist generation flow

- Success and sharing features

#### Phase 4: Polish (1 hour)

- Responsive design fixes

- Loading and error states

- Basic QA testing

- Deployment to Vercel

---

## 10. Success Criteria

### 10.1 MVP Launch Criteria

- [ ]  Authentication works for both users

- [ ]  Session creation and joining functional

- [ ]  Insights calculate correctly

- [ ]  Playlists generate and save to both accounts

- [ ]  Mobile responsive on iOS/Android

- [ ]  No critical bugs

- [ ]  Deployed to production URL

### 10.2 Quality Metrics

- **Reliability:** 95%+ playlist generation success rate

- **Performance:** Insights load <5 seconds

- **UX:** Users complete flow without help

- **Satisfaction:** Playlists feel personalized

### 10.3 Post-Launch Success Indicators

- Users create multiple blends

- Organic social sharing

- Positive qualitative feedback

- Low error rate in monitoring

---

## 11. Risks & Mitigations

### 11.1 Technical Risks

**Risk:** Spotify API rate limiting

**Mitigation:** Cache data aggressively, batch requests, implement retry logic

**Risk:** Token expiration during flow

**Mitigation:** Refresh tokens automatically, handle gracefully in UI

**Risk:** Slow playlist generation

**Mitigation:** Show progress indicators, optimize algorithm, use parallel requests

**Risk:** Database connection issues

**Mitigation:** Vercel Postgres connection pooling, error boundaries

### 11.2 Product Risks

**Risk:** Users don't understand the flow

**Mitigation:** Clear onboarding, helpful tooltips, example screenshots

**Risk:** Generated playlists feel random

**Mitigation:** Test algorithm extensively, gather feedback, iterate

**Risk:** Low adoption (no sharing)

**Mitigation:** Make stats cards visually compelling, easy sharing

---

## 12. Future Roadmap

### Phase 2: Enhanced Features (Week 2-3)

- User accounts and authentication persistence

- Multiple active blend sessions

- Blend history and comparison over time

- Advanced algorithm options

### Phase 3: Social & Viral (Month 2)

- Public blend profiles

- Social media integration

- Leaderboards (most compatible couples)

- Referral system

### Phase 4: Mobile App (Month 3-4)

- React Native iOS/Android apps

- Push notifications for new blends

- Native Spotify SDK integration

### Phase 5: Monetization (Month 5+)

- Premium features (unlimited blends, advanced insights)

- B2B offerings (music festival matching)

- API for third-party integrations

---

## 13. Dependencies & Requirements

### 13.1 External Services

- Spotify Developer Account (free)

- Vercel Account (free tier sufficient)

- Vercel Postgres (free tier sufficient for MVP)

- Domain name (optional)

### 13.2 Development Environment

- Node.js 18+

- npm/pnpm/yarn

- Git

- VS Code (recommended)

### 13.3 Environment Variables Required

- DATABASE_URL

- DIRECT_URL (for migrations)

- NEXTAUTH_SECRET

- NEXTAUTH_URL

- SPOTIFY_CLIENT_ID

- SPOTIFY_CLIENT_SECRET

---

## 14. Appendix: Key Decisions

### Why T3 Stack?

- Best-in-class TypeScript DX

- Type safety across frontend/backend

- Proven Next.js patterns

- Active community support

### Why Prisma over Drizzle?

- Faster MVP setup (30-60 min saved)

- Prisma Studio for debugging

- Better NextAuth integration

- More T3 examples available

### Why NextAuth over Better Auth?

- Pre-configured in T3

- Built-in Spotify provider

- Mature and battle-tested

- Easier troubleshooting

### Why Vercel?

- Zero-config Next.js deployment

- Integrated database (Postgres)

- Edge functions for global performance

- Free tier sufficient for MVP

---

**Document Status:** Ready for Implementation

**Next Steps:** Environment setup → Begin development

**Estimated Delivery:** 1 day MVP
