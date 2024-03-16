import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (exist) {
        throw new Error("User already exists");
      }

      return {
        greeting: `Hello ${input.name}`,
      };
    }),
});
