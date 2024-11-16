import { drizzle } from 'drizzle-orm/libsql'
import { type Client, createClient } from '@libsql/client'

import env from '@/env'
import * as schema from './schema'

const generateClient = () => {
  return createClient({
    url: env.tursoDatabaseUrl,
    authToken: env.tursoAuthToken
  })
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Client | undefined
}

export const conn = globalForDb.conn ?? generateClient()
if (env.isDev) globalForDb.conn = conn

export const db = drizzle(conn, { schema })
