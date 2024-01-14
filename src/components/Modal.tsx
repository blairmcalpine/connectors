import { Close } from "@icons/Close";
import { difficultyToColor, difficultyToEmoji } from "@lib/difficulty";
import { formatDuration } from "@lib/formatTime";
import { useNativeShare } from "@lib/hooks/useNativeShare";
import { usePuzzle } from "@lib/hooks/usePuzzle";
import { useTimer } from "@lib/hooks/useTimer";
import { guessesToSplash, incorrectSplash, type Guess } from "@lib/puzzle";
import { useMemo, useState } from "react";

export const Modal = () => {
  const { name, status, correctGuesses, guesses } = usePuzzle();
  const { completionTime } = useTimer();
  const formattedTime = useMemo(
    () => formatDuration(completionTime ?? 0),
    [completionTime],
  );
  const text = useMemo(
    () => guessesToSharable(guesses, name, formattedTime),
    [guesses, name, formattedTime],
  );
  const { share } = useNativeShare(text);
  const [closed, setClosed] = useState(false);
  if (status !== "complete" || closed) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white opacity-50 dark:bg-black"
        onClick={() => setClosed(true)}
        tabIndex={-1}
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3 rounded-md bg-white px-8 py-8 shadow-lg dark:bg-black md:w-auto md:px-36">
        <button className="absolute right-4 top-4">
          <Close />
        </button>
        <h2 className="mt-3 text-3xl font-bold">
          {correctGuesses.length === 4
            ? guessesToSplash[guesses.length]
            : incorrectSplash}
        </h2>
        <span>{name}</span>
        <span>{formattedTime}</span>
        <div className="flex flex-col gap-0.5">
          {guesses.map(({ words }, idx) => (
            <div key={idx} className="flex gap-0.5">
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
          className="mt-5 flex justify-center rounded-full bg-black px-4 py-3 text-white dark:bg-white dark:text-black"
          onClick={share}
        >
          Share Your Results
        </button>
      </div>
    </div>
  );
};

const guessesToSharable = (
  guesses: Guess[],
  name: string,
  formattedTime: string,
) => {
  const emojis = guesses
    .map(({ words }) =>
      words.map(({ difficulty }) => difficultyToEmoji[difficulty]).join(""),
    )
    .join("\n");
  return `Connectors\n${name}\n${emojis}\n${formattedTime}`;
};
