"use client";

import type { Puzzle } from "@lib/puzzle";
import { shuffle } from "@lib/shuffle";
import { useEffect, useMemo, useState } from "react";

type PuzzleProps = {
  puzzle: Puzzle;
};

export function Puzzle({ puzzle }: PuzzleProps) {
  const originalWords = useMemo(
    () =>
      puzzle.words.map(({ word, difficulty }, idx) => ({
        word,
        idx,
        difficulty,
      })),
    [puzzle.words],
  );
  const [shuffledWords, setShuffledWords] = useState(originalWords);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const onSelect = (idx: number) => {
    setSelectedWords((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };
  useEffect(() => {
    if (selectedWords.size !== 4) return;
    const difficulties = Array.from(selectedWords).map(
      (idx) => originalWords[idx]!.difficulty,
    );
    const difficulty = difficulties[0];
    const allSame = difficulties.every((d) => d === difficulty);
    // LOGIC IS WRONG HERE
    const threeSame = difficulties.filter((d) => d === difficulty).length === 3;
    const oneDifferent =
      difficulties.filter((d) => d !== difficulty).length === 1;
    if (allSame) {
      console.log("success!");
    }
    if (threeSame && oneDifferent) {
      console.log("almost!");
    }
    setSelectedWords(new Set());
  }, [selectedWords, originalWords]);
  return (
    <div className="flex flex-col items-center gap-4 ">
      <div className="relative grid h-[344px] w-[624px] grid-cols-4 grid-rows-4 gap-2">
        {originalWords.map(({ word, idx }) => {
          const location = shuffledWords.findIndex(
            ({ idx: shuffledIdx }) => idx === shuffledIdx,
          );
          const selected = selectedWords.has(idx);
          const row = Math.floor(location / 4) * 88;
          const col = (location % 4) * 158;
          return (
            <button
              key={idx}
              className={`absolute h-20 w-[150px] rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none active:scale-90 ${
                selected && "bg-dark-gray text-white"
              }`}
              style={{
                top: `${row}px`,
                left: `${col}px`,
                transition:
                  "left 0.5s ease-in-out, top 0.5s ease-in-out, transform 75ms ease-in-out",
              }}
              onClick={() => onSelect(idx)}
            >
              {word}
            </button>
          );
        })}
      </div>
      <button
        className="flex justify-center rounded-full border-[1px] border-black px-4 py-3 active:bg-gray"
        onClick={() => setShuffledWords(shuffle(shuffledWords))}
      >
        Shuffle
      </button>
    </div>
  );
}
