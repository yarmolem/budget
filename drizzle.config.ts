import { config } from "dotenv";

import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const tursoDatabaseUrl = process.env.TURSO_CONNECTION_URL;

if (!tursoAuthToken || !tursoDatabaseUrl) {
  throw new Error("TURSO_AUTH_TOKEN and TURSO_DATABASE_URL must be set");
}

export default defineConfig({
  out: "./drizzle",
  dialect: "turso",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: tursoDatabaseUrl,
    authToken: tursoAuthToken,
  },
});
