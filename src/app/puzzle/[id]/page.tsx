import { api } from "@/trpc/server";
import { Header } from "@components/Header";
import { Puzzle } from "@components/Puzzle";
import { PuzzleContextProvider } from "@lib/hooks/usePuzzle";
import { TimerContextProvider } from "@lib/hooks/useTimer";
import { shuffle } from "@lib/shuffle";

type PuzzleProps = {
  params: {
    id: string;
  };
};

const PuzzlePage = async ({ params: { id } }: PuzzleProps) => {
  const puzzle = await api.puzzle.get.query(id);
  const shuffledWords = shuffle(puzzle.words);
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TimerContextProvider>
        <Header title={puzzle.name} timer />
        <main className="relative flex flex-grow items-center justify-center">
          <PuzzleContextProvider puzzle={puzzle} initialShuffle={shuffledWords}>
            <Puzzle />
          </PuzzleContextProvider>
        </main>
      </TimerContextProvider>
    </div>
  );
};

export default PuzzlePage;
