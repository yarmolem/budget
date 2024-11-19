import { cookies, headers } from 'next/headers'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import { auth } from '@/server/auth'

export async function getServerContext() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const headerRecord = Object.fromEntries(headerStore.entries())
  const cookieRecord = Object.fromEntries(
    cookieStore.getAll().map((c) => [c.name, c.value])
  )

  function getHeader(key: string) {
    return headerRecord?.[key] ?? null
  }

  function getCookie(key: string) {
    return cookieRecord?.[key] ?? null
  }

  function setCookie(
    key: string,
    value: string,
    cookie?: Partial<ResponseCookie>
  ) {
    cookieStore.set(key, value, cookie)
  }

  function deleteCookie(key: string) {
    cookieStore.delete(key)
  }

  return {
    headers: headerStore,
    cookies: cookieStore,
    getHeader,
    getCookie,
    setCookie,
    deleteCookie
  }
}

export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return session
}

export async function getIsLoggedIn() {
  const session = await getAuthSession()
  return !!session?.user?.id
}
