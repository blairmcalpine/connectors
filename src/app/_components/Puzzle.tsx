"use client";

import { Modal } from "@components/Modal";
import { difficultyToColor } from "@lib/difficulty";
import type { Guess, Puzzle } from "@lib/puzzle";
import { shuffle } from "@lib/shuffle";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

type PuzzleProps = {
  puzzle: Puzzle;
};

type Status = "none" | "pending" | "failure";

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
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("none");
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const sortedSelectedWords = useMemo(
    () => [...selectedWords].sort((a, b) => a - b),
    [selectedWords],
  );

  const correctGuesses = useMemo(
    () => guesses.filter(({ correct }) => correct),
    [guesses],
  );

  const onWordClick = useCallback((idx: number) => {
    setSelectedWords((prev) => {
      const next = [...prev];
      const idxInPrev = prev.indexOf(idx);
      if (idxInPrev !== -1) {
        next.splice(idxInPrev, 1);
      } else {
        if (next.length === 4) return next;
        next.push(idx);
      }
      return next;
    });
  }, []);

  const onSubmit = useCallback(async () => {
    if (sortedSelectedWords.length !== 4) return;
    setStatus("pending");
    await new Promise((res) => setTimeout(res, 700));
    const guessedWords = Array.from(sortedSelectedWords).map(
      (idx) => originalWords[idx]!,
    );
    const difficulty = guessedWords[0]!.difficulty;
    const numberOfSame = guessedWords.filter(
      (word) => word.difficulty === difficulty,
    ).length;
    if (numberOfSame === 4) {
      const newShuffledWords = [...shuffledWords];
      // Move 4 words to the start, not counting the already correct words
      let hasMoved = false;
      for (let i = 0; i < 4; i++) {
        const idx = shuffledWords.findIndex(
          ({ idx }) => idx === sortedSelectedWords[i],
        );
        if (idx !== i + correctGuesses.length * 4) {
          hasMoved = true;
        }
        newShuffledWords.splice(idx, 1);
        newShuffledWords.splice(
          i + correctGuesses.length * 4,
          0,
          originalWords[sortedSelectedWords[i]!]!,
        );
      }
      setShuffledWords(newShuffledWords);
      if (hasMoved) {
        await new Promise((res) => setTimeout(res, 500));
      }
      setSelectedWords([]);
      setGuesses((prev) => [...prev, { words: guessedWords, correct: true }]);
    } else {
      if (numberOfSame === 3) {
        const oneDifferent =
          guessedWords.filter((word) => word.difficulty !== difficulty)
            .length === 1;
        if (oneDifferent) {
          toast("One away...");
        }
      }
      if (numberOfSame === 1) {
        const endDifficulty = guessedWords.at(-1)?.difficulty;
        const otherThreeSame =
          guessedWords.filter((word) => word.difficulty === endDifficulty)
            .length === 3;
        if (otherThreeSame) {
          toast("One away...");
        }
      }
      setStatus("failure");
      await new Promise((res) => setTimeout(res, 400));
      setGuesses((prev) => [...prev, { words: guessedWords, correct: false }]);
    }
    setStatus("none");
  }, [
    sortedSelectedWords,
    originalWords,
    shuffledWords,
    correctGuesses.length,
  ]);

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-[344px] w-[624px] flex-col">
          {originalWords.map((wordObject) => {
            const { idx, difficulty, word } = wordObject;
            const location = shuffledWords.findIndex(
              ({ idx: shuffledIdx }) => idx === shuffledIdx,
            );
            const row = Math.floor(location / 4) * 88;
            const col = (location % 4) * 158;
            const idxInSelected = sortedSelectedWords.indexOf(idx);
            const selected = idxInSelected !== -1;
            const correct = correctGuesses.find(({ words }) =>
              words.includes(wordObject),
            );
            if (correct) {
              if (location % 4 === 0) {
                const category = puzzle.categories.find(
                  ({ difficulty: categoryDifficulty }) =>
                    categoryDifficulty === difficulty,
                );
                return (
                  <div
                    key={idx}
                    className={`bg-${difficultyToColor[difficulty]} absolute flex h-20 w-full flex-col items-center justify-center rounded-md text-xl uppercase`}
                    style={{ top: `${row}px` }}
                  >
                    <span className="font-bold">{category!.description}</span>
                    <span>
                      {correct.words.map(({ word }) => word).join(", ")}
                    </span>
                  </div>
                );
              }
              return null;
            }
            return (
              <button
                key={idx}
                className={`absolute h-20 w-[150px] rounded-md text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none active:scale-90 ${
                  selected ? "bg-dark-gray text-white" : "bg-gray"
                } ${selected && status === "pending" && `animate-bounce-up`} ${
                  selected && status === "failure" && `animate-shake`
                }`}
                style={{
                  top: `${row}px`,
                  left: `${col}px`,
                  transition:
                    "left 0.5s ease-in-out, top 0.5s ease-in-out, transform 75ms ease-in-out",
                  animationDelay:
                    status === "pending"
                      ? `${idxInSelected * 100}ms`
                      : undefined,
                }}
                onClick={() => onWordClick(idx)}
              >
                {word}
              </button>
            );
          })}
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
            onClick={() => setShuffledWords(shuffle(shuffledWords))}
          >
            Shuffle
          </button>
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 active:bg-gray"
            onClick={() => setSelectedWords([])}
          >
            Deselect All
          </button>
          <button
            className="flex justify-center rounded-full border bg-black px-4 py-3 text-white active:bg-gray disabled:border-disabled-gray disabled:bg-white disabled:text-disabled-gray"
            disabled={selectedWords.length !== 4}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <Modal
        puzzleName={puzzle.name}
        open={
          correctGuesses.length === 4 ||
          correctGuesses.length + 4 === guesses.length
        }
        correct={correctGuesses.length === 4}
        guesses={guesses}
      />
    </div>
  );
}
