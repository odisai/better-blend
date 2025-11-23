# BetterBlend 🎵

> Enhance Spotify's Blend feature for couples with deep music compatibility insights, customizable playlist generation, and shareable moments.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![T3 Stack](https://img.shields.io/badge/T3%20Stack-Enabled-3178C6)](https://create.t3.gg/)

## 🎯 Overview

BetterBlend is a web application that allows two Spotify users to create personalized blended playlists with customizable ratios, time periods, and deep compatibility insights. Unlike Spotify's native Blend feature, BetterBlend offers:

- **Customizable blend ratios** (30/70 to 70/30)
- **Rich compatibility insights** with visualizations
- **Shareable stats cards** for social media
- **Multiple time period options** (4 weeks, 6 months, 1 year)
- **Custom playlist lengths** (25, 50, 100 songs)

## ✨ Features

### MVP Features

- 🔐 **Spotify OAuth Authentication** - Secure login via NextAuth.js
- 🎫 **Session Management** - Create and join blend sessions with unique codes
- 📊 **Compatibility Insights** - Music compatibility score (0-100%) with detailed analytics
- 🎨 **Visualizations** - Radar charts for audio features, shared artists grid
- 🎚️ **Customization** - Adjust blend ratios, time periods, and playlist length
- 🎵 **Playlist Generation** - Create and save playlists to both Spotify accounts
- 📱 **Shareable Cards** - Downloadable stats cards for social sharing

### Coming Soon (Phase 2)

- User accounts with blend history
- Multiple active blend sessions
- Advanced algorithm options
- Artist/genre exclusion filters
- Social features and leaderboards

## 🛠️ Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/):

- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Prisma](https://www.prisma.io)** - Next-generation ORM
- **[NextAuth.js](https://next-auth.js.org)** - Authentication (Spotify OAuth)
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful UI components
- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** - Database
- **[Vercel](https://vercel.com)** - Hosting and deployment

### Additional Libraries

- **Recharts** - Data visualization
- **Zod** - Schema validation
- **nanoid** - Unique code generation
- **html-to-image** - Stats card generation
- **lucide-react** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (or npm/yarn)
- Spotify Developer Account ([Get one here](https://developer.spotify.com/))
- Vercel Account (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/better-blend.git
   cd better-blend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # NextAuth
   NEXTAUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"

   # Spotify OAuth
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   ```

4. **Set up the database**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
better-blend/
├── docs/                    # Documentation
│   └── PRD.md              # Product Requirements Document
├── prisma/                  # Database schema
│   └── schema.prisma
├── public/                  # Static assets
│   ├── images/             # Landing page images
│   └── icons/              # App icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth routes
│   │   │   └── trpc/      # tRPC routes
│   │   ├── _components/   # Page-specific components
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/         # Reusable React components
│   │   └── ui/            # shadcn/ui components
│   ├── server/            # Server-side code
│   │   ├── api/          # tRPC routers
│   │   │   └── routers/  # Individual routers
│   │   ├── auth/         # NextAuth configuration
│   │   └── db.ts         # Prisma client
│   ├── styles/           # Global styles
│   │   └── globals.css
│   ├── trpc/             # tRPC client setup
│   └── lib/              # Utility functions
├── .env                   # Environment variables (not committed)
├── .gitignore
├── components.json        # shadcn/ui configuration
├── next.config.js         # Next.js configuration
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm prisma studio` - Open Prisma Studio (database GUI)

### Database Management

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema changes to database
pnpm prisma db push

# Create a migration
pnpm prisma migrate dev --name migration-name

# Open Prisma Studio
pnpm prisma studio
```

### Code Style

This project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** strict mode

## 📚 Documentation

- **[Product Requirements Document](./docs/PRD.md)** - Complete PRD with architecture, features, and roadmap
- **[T3 Stack Documentation](https://create.t3.gg/)** - Learn about the T3 Stack
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js features and API
- **[tRPC Documentation](https://trpc.io/docs)** - tRPC usage guide
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM docs

## 🎨 Design System

The project uses [shadcn/ui](https://ui.shadcn.com) components with a custom design system:

- **Colors**: Spotify-inspired dark theme with green accents (#1DB954)
- **Typography**: Outfit (headings) and Plus Jakarta Sans (body)
- **Components**: Customizable via `components.json`

## 🔐 Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Client Secret to `.env`
5. Required scopes:
   - `user-read-email`
   - `user-top-read`
   - `playlist-modify-public`
   - `playlist-modify-private`
   - `playlist-read-private`

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

For more details, see the [deployment documentation](https://create.t3.gg/en/deployment/vercel).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with the [T3 Stack](https://create.t3.gg/)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [lucide-react](https://lucide.dev/)
- Inspired by Spotify's Blend feature

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Status:** 🚧 In Development (MVP)

**Version:** 1.0.0

**Last Updated:** November 22, 2025
