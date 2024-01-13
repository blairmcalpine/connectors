import { api } from "@/trpc/server";
import { Header } from "@components/Header";
import { PuzzleTable } from "@components/PuzzleTable";

const Recent = async () => {
  const puzzles = await api.puzzle.popular.query();
  return (
    <div className="flex min-h-[100dvh] flex-col gap-4">
      <Header title="Most Popular Puzzles" />
      <main className="flex justify-center">
        <PuzzleTable puzzles={puzzles} plays />
      </main>
    </div>
  );
};

export default Recent;
