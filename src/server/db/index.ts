import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";

import { env } from "@/env";
import * as schema from "./schema";

const generateTurso = () => {
  return createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
};

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Client | undefined;
};

const conn = globalForDb.conn ?? generateTurso();
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
