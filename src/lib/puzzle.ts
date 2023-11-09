import type { Difficulty } from "@lib/difficulty";

export type Word = {
  word: string;
  difficulty: Difficulty;
};

type Category = {
  description: string;
  difficulty: Difficulty;
};

export type Puzzle = {
  categories: Category[];
  name: string;
  words: Word[];
};
