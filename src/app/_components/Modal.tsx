import { difficultyToColor, type Difficulty } from "@lib/difficulty";

type ModalProps = {
  puzzleName: string;
  open: boolean;
  guesses: Difficulty[][];
};

export function Modal({ puzzleName, open, guesses }: ModalProps) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-white opacity-50" />
      <div className="z-10 flex flex-col items-center justify-center gap-1.5 rounded-md bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold">Perfect!</h2>
        <span>{puzzleName.toUpperCase()}</span>
        <div className="flex flex-col gap-1">
          {guesses.map((guess, idx) => (
            <div key={idx} className="flex">
              {guess.map((difficulty, idx) => (
                <div
                  key={idx}
                  className={`h-8 w-8 rounded bg-${difficultyToColor[difficulty]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
