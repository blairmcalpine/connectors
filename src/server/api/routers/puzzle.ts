import { generate } from "uuid-readable";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { difficultyArray } from "@lib/difficulty";

const createValidator = z.object({
  name: z.string().min(1, { message: "Please give your puzzle a name." }),
  categories: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, { message: "Please give your category a description." }),
        difficulty: z.enum(difficultyArray),
        words: z.array(z.string()).length(difficultyArray.length),
      }),
    )
    .length(difficultyArray.length),
});

export const puzzleRouter = createTRPCRouter({
  create: publicProcedure
    .input(createValidator)
    .mutation(async ({ input, ctx }) => {
      const { name, categories } = input;
      const readableId = generate().replaceAll(" ", "");
      const words = categories.flatMap(({ words, difficulty }) =>
        words.map((word) => ({ word, difficulty })),
      );
      await ctx.db.puzzle.create({
        data: {
          name,
          readableId,
          words: {
            createMany: { data: words },
          },
          categories: { createMany: { data: categories } },
        },
      });
    }),
});
