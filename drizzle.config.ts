import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  driver: "turso",
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ["budget_*"],
} satisfies Config;
