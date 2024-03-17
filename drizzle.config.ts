import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  out: "./drizzle",
  driver: "better-sqlite",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["check_*"],
} satisfies Config;
