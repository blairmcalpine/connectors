"use client";

import { Modal } from "@components/Modal";
import { difficultyToColor } from "@lib/difficulty";
import { usePuzzle, type WordWithIndex } from "@lib/hooks/usePuzzle";
import type { Puzzle } from "@lib/puzzle";
import { useMemo } from "react";

export function Puzzle() {
  const {
    status,
    onSubmit,
    unshuffledWords,
    correctGuesses,
    guesses,
    shuffle,
    deselect,
  } = usePuzzle();
  return (
    <div className="relative w-full px-2">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex md:h-[344px] aspect-square md:aspect-auto max-w-[624px] w-full flex-col">
          {unshuffledWords.map((wordWithIndex, idx) => (
            <WordOrCategory key={idx} wordWithIndex={wordWithIndex} />
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span>Mistakes remaining: </span>
          <div className="flex w-24 items-center gap-2.5">
            {Array.from(Array(4)).map((_, idx) => (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full bg-dark-gray transition-transform duration-300 ${
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
            className="flex justify-center rounded-full border border-black px-4 py-3 active:bg-gray"
            onClick={shuffle}
          >
            Shuffle
          </button>
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 active:bg-gray"
            onClick={deselect}
          >
            Deselect All
          </button>
          <button
            className="flex justify-center rounded-full border bg-black px-4 py-3 text-white active:bg-gray disabled:border-disabled-gray disabled:bg-white disabled:text-disabled-gray"
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
}

function WordOrCategory({ wordWithIndex }: { wordWithIndex: WordWithIndex }) {
  const {
    shuffledWords,
    sortedSelectedWords,
    status,
    onWordClick,
    correctGuesses,
    categories,
  } = usePuzzle();
  const { idx, difficulty, word } = wordWithIndex;
  const location = useMemo(
    () =>
      shuffledWords.findIndex(({ idx: shuffledIdx }) => idx === shuffledIdx),
    [idx, shuffledWords],
  );
  const row = Math.floor(location / 4);
  const col = location % 4;
  const idxInSelected = sortedSelectedWords.indexOf(idx);
  const selected = idxInSelected !== -1;
  const correct = correctGuesses.find(({ words }) =>
    words.includes(wordWithIndex),
  );
  if (correct) {
    if (location % 4 === 0) {
      const category = categories.find(
        ({ difficulty: categoryDifficulty }) =>
          categoryDifficulty === difficulty,
      );
      return (
        <div
          key={idx}
          className="absolute left-0 h-1/4 w-full"
          style={{ top: `${row * 25}%`, paddingTop: `${row ? 8 : 0}px` }}
        >
          <div
            className={`bg-${difficultyToColor[difficulty]} flex h-full w-full flex-col items-center justify-center rounded-md text-xl uppercase`}
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
      className="absolute h-1/4 w-1/4"
      style={{
        paddingTop: `${row ? 8 : 0}px`,
        paddingLeft: `${col ? 8 : 0}px`,
        top: `${row * 25}%`,
        left: `${col * 25}%`,
        transition: "left 0.5s ease-in-out, top 0.5s ease-in-out",
      }}
    >
      <button
        key={idx}
        className={`h-full w-full rounded-md text-center text-xl font-bold uppercase transition-transform ease-in-out placeholder:text-white focus:outline-none active:scale-90 ${
          selected ? "bg-dark-gray text-white" : "bg-gray"
        } ${selected && status === "pending" && `animate-bounce-up`} ${
          selected && status === "failure" && `animate-shake`
        }`}
        style={{
          animationDelay:
            status === "pending" ? `${idxInSelected * 100}ms` : undefined,
        }}
        onClick={() => onWordClick(idx)}
      >
        {word}
      </button>
    </div>
  );
}
