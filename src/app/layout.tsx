import './globals.css'

import { Montserrat, Poppins } from 'next/font/google'
import type { Metadata } from 'next'

import { Providers } from '@/components/providers'

const heading = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading'
})

const body = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Budget App',
  description: 'Budget App'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${heading.variable} ${body.variable} antialiased bg-muted`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
