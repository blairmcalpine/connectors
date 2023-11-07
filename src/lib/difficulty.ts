export type Difficulty = (typeof difficultyArray)[number];

export const difficultyArray = [
  "Straightforward",
  "Medium",
  "Difficult",
  "Tricky",
] as const;

export const difficultyToColor: Record<Difficulty, string> = {
  [difficultyArray[0]]: "yellow",
  [difficultyArray[1]]: "green",
  [difficultyArray[2]]: "blue",
  [difficultyArray[3]]: "purple",
};
