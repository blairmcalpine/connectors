export enum Difficulty {
  Straightforward = "Straightforward",
  Medium = "Medium",
  Difficult = "Difficult",
  Tricky = "Tricky",
}

export const difficultyToColor = {
  [Difficulty.Straightforward]: "yellow",
  [Difficulty.Medium]: "green",
  [Difficulty.Difficult]: "blue",
  [Difficulty.Tricky]: "purple",
};

export const difficultyArray = Object.values(Difficulty);
