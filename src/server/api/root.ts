import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { authRouter } from "./routers/auth";
import { usersRouter } from "./routers/users";
import { categoriesRouter } from "./routers/categories";
import { transactionsRouter } from "./routers/transactions";
import { tagsRouter } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  auth: authRouter,
  users: usersRouter,
  categories: categoriesRouter,
  transactions: transactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
