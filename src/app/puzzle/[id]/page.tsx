import { api } from "@/trpc/server";
import { Header } from "@components/Header";
import { Puzzle } from "@components/Puzzle";
import { PuzzleContextProvider } from "@lib/hooks/usePuzzle";
import { shuffle } from "@lib/shuffle";

type PuzzleProps = {
  params: {
    id: string;
  };
};

export default async function PuzzlePage({ params: { id } }: PuzzleProps) {
  const puzzle = await api.puzzle.get.query(id);
  const shuffledWords = shuffle(puzzle.words);
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title={puzzle.name.toUpperCase()} />
      <main className="relative flex flex-grow items-center justify-center">
        <PuzzleContextProvider puzzle={puzzle} initialShuffle={shuffledWords}>
          <Puzzle />
        </PuzzleContextProvider>
      </main>
    </div>
  );
}
