import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  update: publicProcedure
    .input(z.object({ name: z.string().min(1), id: z.number() }))
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .update(posts)
        .set({
          name: input.name,
        })
        .where(eq(posts.id, input.id))
        .returning(),
    ),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(posts).where(eq(posts.id, input.id)).get();
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany();
  }),
});
