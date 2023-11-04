"use client";

import {
  difficultyArray,
  difficultyToColor,
  type Difficulty,
} from "@lib/difficulty";
import { useState } from "react";

type CreateCategoryProps = {
  difficulty: Difficulty;
};

type Category = {
  desription: string;
  difficulty: Difficulty;
  words: string[];
};

export function PuzzleCreator() {
  return (
    <form className="flex w-[624px] flex-col gap-2">
      {difficultyArray.map((difficulty) => (
        <CreateCategory difficulty={difficulty} key={difficulty} />
      ))}
    </form>
  );
}

function CreateCategory({ difficulty }: CreateCategoryProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        className={`bg-${difficultyToColor[difficulty]} h-20 rounded-md text-xl font-bold text-white`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        Create {difficulty} Category
      </button>
      <div
        className={`overflow-hidden ${
          open ? "h-48" : "h-0"
        } flex gap-2 transition-all duration-500 ease-in-out`}
      >
        {difficultyArray.map((difficulty) => (
          <input key={difficulty} />
        ))}
      </div>
    </div>
  );
}
