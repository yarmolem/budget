'use client'

import { signOut } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'

export function useSignOut() {
  return useMutation({ mutationFn: () => signOut() })
}
