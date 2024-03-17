import { z } from "zod";
import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getUserById: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      if (!user) {
        return null;
      }

      const { password, ...rest } = user;

      return rest;
    }),
});
