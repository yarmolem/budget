import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/server/db'
import * as schema from '@/server/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: 'sqlite'
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  advanced: {
    cookiePrefix: 'budget'
  }
})
