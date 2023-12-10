import { Close } from "@icons/Close";
import { difficultyToColor, difficultyToEmoji } from "@lib/difficulty";
import { useNativeShare } from "@lib/hooks/useNativeShare";
import { usePuzzle } from "@lib/hooks/usePuzzle";
import { guessesToSplash, incorrectSplash, type Guess } from "@lib/puzzle";
import { useMemo, useState } from "react";

export function Modal() {
  const { name, status, correctGuesses, guesses } = usePuzzle();
  const text = useMemo(() => guessesToSharable(guesses, name), [guesses, name]);
  const share = useNativeShare(text);
  const [closed, setClosed] = useState(false);
  if (status !== "complete" || closed) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white opacity-50"
        onClick={() => setClosed(true)}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 rounded-md bg-white md:px-36 px-8 py-8 md:w-auto w-full shadow-lg">
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
        <button
          className="mt-5 flex justify-center rounded-full bg-black px-4 py-3 text-white"
          onClick={share}
        >
          Share Your Results
        </button>
      </div>
    </div>
  );
}

function guessesToSharable(guesses: Guess[], name: string) {
  const emojis = guesses
    .map(({ words }) =>
      words.map(({ difficulty }) => difficultyToEmoji[difficulty]).join(""),
    )
    .join("\n");
  return `Connectors\n${name.toUpperCase()}\n${emojis}`;
}
