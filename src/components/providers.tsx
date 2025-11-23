"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "@/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
