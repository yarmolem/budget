"use client";

import React, { createContext, useContext } from "react";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider, type SessionProviderProps } from "next-auth/react";

import { TRPCReactProvider } from "@/trpc/react";
import { type Language, fallbackLng } from "@/i18n/settings";
import { CookiesProvider } from "react-cookie";

const LanguageContext = createContext({
  lng: fallbackLng,
});

export const useLanguageCtx = () => useContext(LanguageContext);

export default function Providers({
  lng = fallbackLng,
  session,
  children,
}: {
  lng?: Language;
  children: React.ReactNode;
  session: SessionProviderProps["session"];
}) {
  return (
    <>
      <CookiesProvider>
        <LanguageContext.Provider value={{ lng }}>
          <NextTopLoader showSpinner={false} />
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
            >
              <SessionProvider session={session}>{children}</SessionProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </LanguageContext.Provider>
      </CookiesProvider>
    </>
  );
}
