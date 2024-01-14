import { generate } from "uuid-readable";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { difficultyArray } from "@lib/difficulty";
import { TRPCError } from "@trpc/server";

const createValidator = z.object({
  name: z.string().min(1, { message: "Please give your puzzle a name." }),
  categories: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, { message: "Please give your category a description." }),
        difficulty: z.enum(difficultyArray),
      }),
    )
    .length(difficultyArray.length),
  words: z
    .array(
      z.object({
        word: z.string().min(1, { message: "Please do not use empty words." }),
        difficulty: z.enum(difficultyArray),
      }),
    )
    .length(difficultyArray.length ** 2),
});

const completionValidator = z.object({
  time: z.number().min(1, { message: "Please provide a valid time." }),
  puzzleId: z.string().cuid({ message: "Please provide a valid puzzle cuid." }),
});

export const puzzleRouter = createTRPCRouter({
  create: publicProcedure
    .input(createValidator)
    .mutation(async ({ input, ctx }) => {
      const { name, categories, words } = input;
      const readableId = generate().replaceAll(" ", "");
      const { readableId: id } = await ctx.db.puzzle.create({
        data: {
          name,
          readableId,
          words: {
            createMany: { data: words },
          },
          categories: { createMany: { data: categories } },
        },
      });
      return { id, name };
    }),
  get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const puzzle = await ctx.db.puzzle.findUnique({
      where: { readableId: input },
      include: {
        words: {
          orderBy: { difficulty: "asc" },
        },
        categories: {
          orderBy: { difficulty: "asc" },
        },
      },
    });
    if (!puzzle) {
      throw new TRPCError({ message: "Puzzle not found", code: "NOT_FOUND" });
    }
    return puzzle;
  }),
  recent: publicProcedure.query(async ({ ctx }) => {
    const puzzles = await ctx.db.puzzle.findMany({
      include: {
        words: {
          orderBy: { difficulty: "asc" },
        },
        categories: {
          orderBy: { difficulty: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
    return puzzles;
  }),
  popular: publicProcedure.query(async ({ ctx }) => {
    const puzzles = await ctx.db.puzzle.findMany({
      include: {
        words: {
          orderBy: { difficulty: "asc" },
        },
        categories: {
          orderBy: { difficulty: "asc" },
        },
        completions: true,
      },
      orderBy: {
        completions: {
          _count: "desc",
        },
      },
      take: 20,
    });
    return puzzles;
  }),
  completion: publicProcedure
    .input(completionValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.puzzleCompletion.create({
        data: input,
      });
    }),
});
