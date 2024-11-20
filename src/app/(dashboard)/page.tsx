'use client'

import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: () => signOut()
  })

  return (
    <div>
      <Button
        isLoading={isPending}
        onClick={() =>
          mutate(undefined, {
            onSuccess: () => {
              router.refresh()
            },
            onError: () => {
              toast.error('Failed to sign out')
            }
          })
        }
      >
        Sign Out
      </Button>
    </div>
  )
}
