import { auth } from '@/server/auth'
import {
  cookies as getCookieStore,
  headers as getHeaderStore
} from 'next/headers'

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function getServerContext() {
  const cookieStore = getCookieStore()
  const headerStore = getHeaderStore()

  const headers = new Headers(headerStore)
  const cookies = new Map<string, string>()

  for (const cookie of cookieStore.getAll()) {
    cookies.set(cookie.name, cookie.value)
  }

  function getAllHeaders() {
    return headers
  }

  function getAllCookies() {
    return Object.fromEntries(Array.from(cookies.entries()))
  }

  function getHeader(key: string) {
    return headers.get(key) ?? null
  }

  function getCookie(key: string) {
    return cookies.get(key) ?? null
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
    getAllHeaders,
    getAllCookies,
    getHeader,
    getCookie,
    setCookie,
    deleteCookie
  }
}

export async function getAuthSession() {
  const ctx = await getServerContext()

  const session = await auth.api.getSession({
    headers: ctx.getAllHeaders()
  })

  return session
}

export async function getIsLoggedIn() {
  const session = await getAuthSession()
  return !!session?.user?.id
}
