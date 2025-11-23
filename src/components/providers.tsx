"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "@/trpc/react";

// Mock session for development
const mockSession = {
  user: {
    id: "dev-user-id",
    name: "Dev User",
    email: "dev@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export function Providers({ children }: { children: React.ReactNode }) {
  // In development, provide a mock session
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <SessionProvider
      session={isDevelopment ? mockSession : undefined}
      basePath="/api/auth"
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
