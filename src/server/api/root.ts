import { puzzleRouter } from "@/server/api/routers/puzzle";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  puzzle: puzzleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
