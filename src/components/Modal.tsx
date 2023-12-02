import { Close } from "@icons/Close";
import { difficultyToColor } from "@lib/difficulty";
import { usePuzzle } from "@lib/hooks/usePuzzle";
import { guessesToSplash, incorrectSplash } from "@lib/puzzle";
import { useState } from "react";

export function Modal() {
  const { name, status, correctGuesses, guesses } = usePuzzle();
  const [closed, setClosed] = useState(false);
  if (status !== "complete" || closed) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white opacity-50"
        onClick={() => setClosed(true)}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 rounded-md bg-white px-36 py-8 shadow-lg">
        <button className="absolute right-4 top-4">
          <Close />
        </button>
        <h2 className="mt-3 text-3xl font-bold">
          {correctGuesses.length === 4
            ? guessesToSplash[guesses.length]
            : incorrectSplash}
        </h2>
        <span className="uppercase">{name}</span>
        <div className="flex flex-col gap-1">
          {guesses.map(({ words }, idx) => (
            <div key={idx} className="flex">
              {words.map(({ difficulty }, idx) => (
                <div
                  key={idx}
                  className={`h-8 w-8 rounded bg-${difficultyToColor[difficulty]}`}
                />
              ))}
            </div>
          ))}
        </div>
        <button className="mt-5 flex justify-center rounded-full bg-black px-4 py-3 text-white">
          Share Your Results
        </button>
      </div>
    </div>
  );
}