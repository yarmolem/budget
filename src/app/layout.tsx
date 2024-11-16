import './globals.css'

import { Nunito_Sans } from 'next/font/google'
import type { Metadata } from 'next'

import { Providers } from '@/components/providers'

const inter = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Budget App',
  description: 'Budget App'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
