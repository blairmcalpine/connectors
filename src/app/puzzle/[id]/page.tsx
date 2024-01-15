import { api } from "@/trpc/server";
import { Header } from "@components/Header";
import { Puzzle } from "@components/Puzzle";
import { PuzzleContextProvider } from "@lib/hooks/usePuzzle";
import { TimerContextProvider } from "@lib/hooks/useTimer";
import { shuffle } from "@lib/shuffle";

export type PuzzlePageProps = {
  params: {
    id: string;
  };
};

const PuzzlePage = ({ params: { id } }: PuzzlePageProps) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <TimerContextProvider puzzleId={id}>
        <PuzzleQuery id={id} />
      </TimerContextProvider>
    </div>
  );
};

export default PuzzlePage;

type PuzzleQueryProps = {
  id: string;
};

const PuzzleQuery = async ({ id }: PuzzleQueryProps) => {
  const puzzle = await api.puzzle.get.query(id);
  if (!puzzle)
    return (
      <>
        <Header title="Puzzle Not Found" />
        <main className="relative flex flex-grow flex-col items-center justify-center gap-4">
          <h1>
            There was no puzzle found. Please ensure your link is correct.
          </h1>
        </main>
      </>
    );
  const shuffledWords = shuffle(puzzle.words);
  return (
    <>
      <Header title={puzzle.name} timer />
      <main className="relative flex flex-grow items-center justify-center">
        <PuzzleContextProvider puzzle={puzzle} initialShuffle={shuffledWords}>
          <Puzzle />
        </PuzzleContextProvider>
      </main>
    </>
  );
};

export const generateMetadata = async ({ params: { id } }: PuzzlePageProps) => {
  const puzzle = await api.puzzle.get.query(id);
  if (!puzzle) return {};
  return {
    title: `Play ${puzzle.name}`,
    openGraph: {
      title: `Play ${puzzle.name} - Connectors`,
      description:
        "A better version of New York Times' Connections game. Create your own puzzles and share them with others!",
      siteName: "Connectors",
      type: "website",
    },
  };
};
