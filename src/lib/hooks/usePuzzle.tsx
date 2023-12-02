"use client";

import type { Difficulty } from "@lib/difficulty";
import type { Category, Guess, Puzzle } from "@lib/puzzle";
import { shuffle as arrayShuffle } from "@lib/shuffle";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

type Status = "guessing" | "pending" | "failure" | "submittable" | "complete";

export type WordWithIndex = {
  word: string;
  idx: number;
  difficulty: Difficulty;
};

type PuzzleContextValues = {
  status: Status;
  unshuffledWords: WordWithIndex[];
  shuffledWords: WordWithIndex[];
  onWordClick: (idx: number) => void;
  onSubmit: () => Promise<void>;
  sortedSelectedWords: number[];
  correctGuesses: Guess[];
  guesses: Guess[];
  shuffle: () => void;
  deselect: () => void;
  categories: Category[];
  name: string;
};

const PuzzleContext = createContext<PuzzleContextValues | null>(null);

export const PuzzleContextProvider = ({
  children,
  puzzle,
}: {
  children: ReactNode;
  puzzle: Puzzle;
}) => {
  const unshuffledWords = useMemo(
    () =>
      puzzle.words.map(({ word, difficulty }, idx) => ({
        word,
        idx,
        difficulty,
      })),
    [puzzle.words],
  );

  const [shuffledWords, setShuffledWords] = useState(unshuffledWords);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("guessing");
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const shuffle = useCallback(
    () => setShuffledWords(arrayShuffle(shuffledWords)),
    [shuffledWords],
  );

  const deselect = useCallback(() => setSelectedWords([]), []);

  const sortedSelectedWords = useMemo(
    () => [...selectedWords].sort((a, b) => a - b),
    [selectedWords],
  );

  const correctGuesses = useMemo(
    () => guesses.filter(({ correct }) => correct),
    [guesses],
  );

  const onWordClick = useCallback(
    (idx: number) => {
      setSelectedWords((prev) => {
        const next = [...prev];
        const idxInPrev = prev.indexOf(idx);
        if (idxInPrev !== -1) {
          next.splice(idxInPrev, 1);
          if (status === "submittable") setStatus("guessing");
        } else {
          if (next.length === 4) return next;
          next.push(idx);
          if (next.length === 4) setStatus("submittable");
        }
        return next;
      });
    },
    [status],
  );

  const onSubmit = useCallback(async () => {
    if (status !== "submittable") return;
    setStatus("pending");
    await new Promise((res) => setTimeout(res, 700));
    const guessedWords = Array.from(sortedSelectedWords).map(
      (idx) => unshuffledWords[idx]!,
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
          unshuffledWords[sortedSelectedWords[i]!]!,
        );
      }
      setShuffledWords(newShuffledWords);
      if (hasMoved) {
        await new Promise((res) => setTimeout(res, 500));
      }
      setSelectedWords([]);
      setGuesses((prev) => [...prev, { words: guessedWords, correct: true }]);
      if (correctGuesses.length === 3) return setStatus("complete");
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
      if (correctGuesses.length + 3 === guesses.length)
        return setStatus("complete");
    }
    setStatus("guessing");
  }, [
    sortedSelectedWords,
    unshuffledWords,
    shuffledWords,
    correctGuesses.length,
    status,
    guesses.length,
  ]);

  return (
    <PuzzleContext.Provider
      value={{
        status,
        unshuffledWords,
        shuffledWords,
        onWordClick,
        onSubmit,
        sortedSelectedWords,
        correctGuesses,
        guesses,
        shuffle,
        deselect,
        categories: puzzle.categories,
        name: puzzle.name,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};

export const usePuzzle = () => {
  const methods = useContext(PuzzleContext);
  if (!methods)
    throw new Error("usePuzzle must be used within a PuzzleContextProvider");
  return methods;
};
