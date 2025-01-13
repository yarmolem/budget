import React from 'react'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}
