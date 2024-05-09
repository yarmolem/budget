import { z } from "zod";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { users } from "@/server/db/schema";
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (exist) {
        throw new Error("User already exists");
      }

      const id = randomUUID();
      const hashedPassword = await argon2.hash(input.password);

      await ctx.db.insert(users).values({
        id,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        id,
        name: input.name,
        email: input.email,
      };
    }),
});
