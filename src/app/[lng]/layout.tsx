import "@/styles/globals.css";

import { dir } from "i18next";
import { Toaster } from "react-hot-toast";
import { Nunito_Sans } from "next/font/google";

import Providers from "@/components/providers";
import { getServerAuthSession } from "@/server/auth";
import { type Language, languages } from "@/i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const inter = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Budget App",
  description: "Budget App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
  params: { lng },
}: {
  params: { lng: Language };
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <Providers lng={lng} session={session}>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
