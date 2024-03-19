import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  driver: "turso",
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["check_*"],
} satisfies Config;
