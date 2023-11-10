"use client";

import { Difficulty, difficultyToColor } from "@lib/difficulty";
import type { Puzzle } from "@lib/puzzle";
import { shuffle } from "@lib/shuffle";
import { set } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

type PuzzleProps = {
  puzzle: Puzzle;
};

type Status = "none" | "pending" | "failure";

export function Puzzle({ puzzle }: PuzzleProps) {
  const [originalWords, setOriginalWords] = useState(() =>
    puzzle.words.map(({ word, difficulty }, idx) => ({
      word,
      idx,
      difficulty,
    })),
  );

  const [shuffledWords, setShuffledWords] = useState(originalWords);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("none");
  const [attempts, setAttempts] = useState(4);
  const [correctDifficulties, setCorrectDifficulties] = useState<Difficulty[]>(
    [],
  );

  const onWordClick = useCallback((idx: number) => {
    setSelectedWords((prev) => {
      const next = [...prev];
      const idxInPrev = prev.indexOf(idx);
      if (idxInPrev !== -1) {
        next.splice(idxInPrev, 1);
      } else {
        if (next.length === 4) return next;
        const idxInPrev = prev.findIndex((element) => element > idx);
        if (idxInPrev === -1) {
          next.push(idx);
        } else {
          next.splice(idxInPrev, 0, idx);
        }
      }
      return next;
    });
  }, []);

  const onSubmit = useCallback(async () => {
    if (selectedWords.length !== 4) return;
    setStatus("pending");
    await new Promise((res) => setTimeout(res, 700));
    const difficulties = Array.from(selectedWords).map(
      (idx) => originalWords[idx]!.difficulty,
    );
    const difficulty = difficulties[0]!;
    const numberOfSame = difficulties.filter((d) => d === difficulty).length;
    if (numberOfSame === 4) {
      const newShuffledWords = [...shuffledWords];
      const newOriginalWords = [...originalWords];
      for (let i = 0; i < 4; i++) {
        const idx = selectedWords[i]!;
        const word = newOriginalWords[idx]!;
        newShuffledWords.splice(idx, 1);
        newShuffledWords.splice(i, 0, word);
        newOriginalWords.splice(idx, 1);
        newOriginalWords.splice(i, 0, word);
      }
      setShuffledWords(newShuffledWords);
      await new Promise((res) => setTimeout(res, 500));
      setCorrectDifficulties((prev) => [...prev, difficulty]);
      setSelectedWords([]);
      setOriginalWords(newOriginalWords.slice(4));
      setShuffledWords((words) => words.slice(4));
    } else {
      if (numberOfSame === 3) {
        const oneDifferent =
          difficulties.filter((d) => d !== difficulty).length === 1;
        if (oneDifferent) {
          toast("One away...");
        }
      }
      if (numberOfSame === 1) {
        const endDifficulty = difficulties.at(-1);
        const otherThreeSame =
          difficulties.filter((d) => d === endDifficulty).length === 3;
        if (otherThreeSame) {
          toast("One away...");
        }
      }
      setStatus("failure");
      setAttempts((prev) => Math.max(prev - 1, 0));
      await new Promise((res) => setTimeout(res, 400));
    }
    setStatus("none");
  }, [originalWords, selectedWords, shuffledWords]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-[344px] w-[624px] flex-col">
        {correctDifficulties.map((difficulty, idx) => (
          <div
            key={idx}
            className={`bg-${difficultyToColor[difficulty]} h-20 rounded-md text-xl font-bold text-white`}
          ></div>
        ))}
        {originalWords.map(({ word, idx }) => {
          const location = shuffledWords.findIndex(
            ({ idx: shuffledIdx }) => idx === shuffledIdx,
          );
          const row =
            (Math.floor(location / 4) + correctDifficulties.length) * 88;
          const col = (location % 4) * 158;
          const idxInSelected = selectedWords.indexOf(idx);
          const selected = idxInSelected !== -1;
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
                  status === "pending" ? `${idxInSelected * 100}ms` : undefined,
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
                idx + 1 > attempts ? "scale-0" : "scale-100"
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
          className="disabled:text-disabled-gray disabled:border-disabled-gray flex justify-center rounded-full border bg-black px-4 py-3 text-white active:bg-gray disabled:bg-white"
          disabled={selectedWords.length !== 4}
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
