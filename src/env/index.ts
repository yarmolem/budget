import { z } from 'zod'

const server = z.object({
  TURSO_AUTH_TOKEN: z.string(),
  TURSO_DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
})

const processEnv: Record<keyof z.infer<typeof server>, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL
}

const parsed = server.safeParse(processEnv)

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  )
  throw new Error('Invalid environment variables')
}

const env = process.env as z.infer<typeof server>

export default {
  isDev: env.NODE_ENV === 'development',
  tursoAuthToken: env.TURSO_AUTH_TOKEN,
  tursoDatabaseUrl: env.TURSO_DATABASE_URL
}
