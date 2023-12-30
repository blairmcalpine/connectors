import type { Difficulty } from "@lib/difficulty";
import type { Word } from "@prisma/client";

export type Category = {
  description: string;
  difficulty: Difficulty;
};

export type Puzzle = {
  categories: Category[];
  name: string;
  words: Word[];
};

export type Guess = {
  words: Word[];
  correct: boolean;
};

export const guessesToSplash: Record<number, string> = {
  [4]: "Perfect!",
  [5]: "Great!",
  [6]: "Solid!",
  [7]: "Phew!",
};

export const incorrectSplash = "Next Time!";
