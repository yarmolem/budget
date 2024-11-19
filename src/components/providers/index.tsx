'use client'

import { Toaster } from 'react-hot-toast'
import { TRPCProvider } from './trpc.provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCProvider>{children}</TRPCProvider>
      <Toaster
        toastOptions={{
          error: {
            style: {
              backgroundColor: 'hsl(var(--destructive))',
              color: 'hsl(var(--destructive-foreground))'
            },
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))'
            }
          },
          success: {
            style: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))'
            },
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))'
            }
          },
          loading: {
            style: {
              backgroundColor: 'hsl(var(--ring))',
              color: 'hsl(var(--ring))'
            },
            iconTheme: {
              primary: 'hsl(var(--ring))',
              secondary: 'hsl(var(--ring))'
            }
          }
        }}
      />
    </>
  )
}
