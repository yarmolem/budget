import { drizzle } from "drizzle-orm/libsql";
import { type Client, createClient } from "@libsql/client";

import { env } from "@/env";
import * as schema from "./schema";

const generateClient = () => {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
};

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Client | undefined;
};

export const conn = globalForDb.conn ?? generateClient();
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
