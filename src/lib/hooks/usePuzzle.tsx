"use client";

import { useTimer } from "@lib/hooks/useTimer";
import type { Category, Guess, Puzzle } from "@lib/puzzle";
import { shuffle as arrayShuffle } from "@lib/shuffle";
import type { Word } from "@prisma/client";
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

type PuzzleContextValues = {
  status: Status;
  shuffledWords: Word[];
  initialShuffle: Word[];
  onWordClick: (word: Word) => void;
  onSubmit: () => Promise<void>;
  correctGuesses: Guess[];
  selectedWords: Word[];
  sortedSelectedWords: Word[];
  guesses: Guess[];
  shuffle: () => void;
  deselect: () => void;
  categories: Category[];
  name: string;
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PuzzleContext = createContext<PuzzleContextValues | null>(null);

export const PuzzleContextProvider = ({
  children,
  puzzle,
  initialShuffle,
}: {
  children: ReactNode;
  puzzle: Puzzle;
  initialShuffle: Word[];
}) => {
  const [shuffledWords, setShuffledWords] = useState(initialShuffle);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [status, setStatus] = useState<Status>("guessing");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const { setEndTime } = useTimer();

  // Selected words sorted by the current shuffle position
  const sortedSelectedWords = useMemo(() => {
    const newSelectedWords = [...selectedWords];
    return newSelectedWords.sort(
      (a, b) => shuffledWords.indexOf(a) - shuffledWords.indexOf(b),
    );
  }, [shuffledWords, selectedWords]);

  const correctGuesses = useMemo(
    () => guesses.filter(({ correct }) => correct),
    [guesses],
  );

  const shuffle = useCallback(
    () =>
      setShuffledWords(arrayShuffle(shuffledWords, correctGuesses.length * 4)),
    [shuffledWords, correctGuesses.length],
  );

  const deselect = useCallback(() => setSelectedWords([]), []);

  const onWordClick = useCallback(
    (word: Word) => {
      const idxInUnshuffled = (word: Word) =>
        puzzle.words.findIndex((w) => w.id === word.id);
      setSelectedWords((prev) => {
        const next = [...prev];
        const idxInPrev = prev.indexOf(word);
        if (idxInPrev !== -1) {
          next.splice(idxInPrev, 1);
          if (status === "submittable") setStatus("guessing");
        } else {
          if (next.length === 4) return next;
          const location = next.findIndex(
            (w) => idxInUnshuffled(w) > idxInUnshuffled(word),
          );
          next.splice(location === -1 ? next.length : location, 0, word);
          if (next.length === 4) setStatus("submittable");
        }
        return next;
      });
    },
    [status, puzzle.words],
  );

  const onSubmit = useCallback(async () => {
    if (status !== "submittable") return;
    setStatus("pending");
    // Wait for pending anumation to finish
    await sleep(700);
    const difficulty = selectedWords[0]!.difficulty;
    const numberOfSame = selectedWords.filter(
      (word) => word.difficulty === difficulty,
    ).length;
    if (numberOfSame === 4) {
      const newShuffledWords = [...shuffledWords];
      // Move 4 words to the start, not counting the already correct words
      let hasMoved = false;
      for (let i = 0; i < 4; i++) {
        const idx = newShuffledWords.indexOf(selectedWords[i]!);
        if (idx !== i + correctGuesses.length * 4) {
          hasMoved = true;
          const temp = newShuffledWords[i + correctGuesses.length * 4]!;
          newShuffledWords[i + correctGuesses.length * 4] =
            newShuffledWords[idx]!;
          newShuffledWords[idx] = temp;
        }
      }
      setShuffledWords(newShuffledWords);
      if (hasMoved) {
        // Wait for sliding animation to finish
        await sleep(500);
      }
      setSelectedWords([]);
      setGuesses((prev) => [...prev, { words: selectedWords, correct: true }]);
      if (correctGuesses.length === 3) {
        setEndTime(Date.now());
        // Wait 1s before displaying modal
        await sleep(1000);
        return setStatus("complete");
      }
    } else {
      if (numberOfSame === 3) {
        const oneDifferent =
          selectedWords.filter((word) => word.difficulty !== difficulty)
            .length === 1;
        if (oneDifferent) {
          toast("One away...");
        }
      }
      if (numberOfSame === 1) {
        const endDifficulty = selectedWords.at(-1)?.difficulty;
        const otherThreeSame =
          selectedWords.filter((word) => word.difficulty === endDifficulty)
            .length === 3;
        if (otherThreeSame) {
          toast("One away...");
        }
      }
      setStatus("failure");
      // Wait for failure animation to finish
      await sleep(400);
      setGuesses((prev) => [...prev, { words: selectedWords, correct: false }]);
      if (correctGuesses.length + 3 === guesses.length) {
        setEndTime(Date.now());
        return setStatus("complete");
      }
    }
    setStatus("guessing");
  }, [
    selectedWords,
    shuffledWords,
    correctGuesses.length,
    status,
    guesses.length,
    setEndTime,
  ]);

  return (
    <PuzzleContext.Provider
      value={{
        status,
        shuffledWords,
        selectedWords,
        sortedSelectedWords,
        onWordClick,
        onSubmit,
        correctGuesses,
        guesses,
        shuffle,
        deselect,
        initialShuffle,
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
