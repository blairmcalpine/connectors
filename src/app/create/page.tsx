import { Header } from "@components/Header";
import { PuzzleCreator } from "@components/PuzzleCreator";

export default function Create() {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title="Create a Puzzle" />
      <main className="flex flex-grow items-center justify-center">
        <PuzzleCreator />
      </main>
    </div>
  );
}
