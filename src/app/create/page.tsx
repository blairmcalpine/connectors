import { Header } from "@components/Header";
import { PuzzleCreator } from "@components/PuzzleCreator";

export const metadata = {
  title: "Create a Puzzle",
};

const Create = () => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title="Create a Puzzle" />
      <main className="flex flex-grow items-center justify-center">
        <PuzzleCreator />
      </main>
    </div>
  );
};

export default Create;
