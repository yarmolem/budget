"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

import { SessionProvider, type SessionProviderProps } from "next-auth/react";
import { TRPCReactProvider } from "@/trpc/react";
export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <SessionProvider session={session}>{children}</SessionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </>
  );
}
