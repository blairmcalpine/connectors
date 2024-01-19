"use client";

import { Modal } from "@components/Modal";
import { difficultyToColor } from "@lib/difficulty";
import { usePuzzle } from "@lib/hooks/usePuzzle";
import type { Word } from "@prisma/client";
import { useMemo } from "react";

export const Puzzle = () => {
  const {
    status,
    onSubmit,
    initialShuffle,
    correctGuesses,
    guesses,
    shuffle,
    deselect,
  } = usePuzzle();
  return (
    <div className="relative w-full px-1">
      <div className="flex flex-col items-center gap-3 md:gap-6">
        <div className="relative flex aspect-square w-full max-w-[624px] flex-col md:aspect-auto md:h-[344px]">
          {initialShuffle.map((word, idx) => (
            <WordOrCategory key={idx} wordObject={word} />
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span>Mistakes remaining: </span>
          <div className="flex w-24 items-center gap-2.5">
            {Array.from(Array(4)).map((_, idx) => (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full bg-dark-gray transition-transform duration-300 dark:bg-gray ${
                  idx + 1 > 4 - (guesses.length - correctGuesses.length)
                    ? "scale-0"
                    : "scale-100"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 active:bg-gray dark:border-white"
            onClick={shuffle}
          >
            Shuffle
          </button>
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 active:bg-gray dark:border-white"
            onClick={deselect}
          >
            Deselect All
          </button>
          <button
            className="flex justify-center rounded-full border bg-black px-4 py-3 text-white active:bg-gray disabled:border-disabled-gray disabled:bg-white disabled:text-disabled-gray dark:bg-white dark:text-black dark:disabled:bg-black"
            disabled={status !== "submittable"}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <Modal />
    </div>
  );
};

type WordOrCategoryProps = {
  wordObject: Word;
};

const WordOrCategory = ({ wordObject }: WordOrCategoryProps) => {
  const {
    shuffledWords,
    status,
    onWordClick,
    correctGuesses,
    categories,
    sortedSelectedWords,
  } = usePuzzle();
  const { difficulty, word } = wordObject;
  const location = useMemo(
    () => shuffledWords.indexOf(wordObject),
    [shuffledWords, wordObject],
  );
  const row = Math.floor(location / 4);
  const col = location % 4;
  const idxInSelected = sortedSelectedWords.indexOf(wordObject);
  const selected = idxInSelected !== -1;
  const correct = correctGuesses.find(({ words }) =>
    words.includes(wordObject),
  );
  if (correct) {
    if (location % 4 === 0) {
      const category = categories.find(
        ({ difficulty: categoryDifficulty }) =>
          categoryDifficulty === difficulty,
      );
      return (
        <div
          className="absolute left-0 h-1/4 w-full p-1"
          style={{ top: `${row * 25}%` }}
        >
          <div
            className={`bg-${difficultyToColor[difficulty]} flex h-full w-full flex-col items-center justify-center rounded-md text-xl uppercase dark:text-black`}
          >
            <span className="font-bold">{category!.description}</span>
            <span>{correct.words.map(({ word }) => word).join(", ")}</span>
          </div>
        </div>
      );
    }
    return null;
  }
  return (
    <div
      className="absolute h-1/4 w-1/4 p-1"
      style={{
        top: `${row * 25}%`,
        left: `${col * 25}%`,
        transition: "left 0.5s ease-in-out, top 0.5s ease-in-out",
      }}
    >
      <button
        className={`h-full w-full break-words rounded-md text-center text-xl font-bold uppercase transition-transform ease-in-out placeholder:text-white focus:outline-none active:scale-90 dark:text-black ${
          selected
            ? "bg-dark-gray text-white dark:bg-disabled-gray dark:text-black"
            : "bg-gray"
        } ${selected && status === "pending" && `animate-bounce-up`} ${
          selected && status === "failure" && `animate-shake`
        }`}
        style={{
          animationDelay:
            status === "pending" ? `${idxInSelected * 100}ms` : undefined,
        }}
        onClick={() => onWordClick(wordObject)}
      >
        {word}
      </button>
    </div>
  );
};
