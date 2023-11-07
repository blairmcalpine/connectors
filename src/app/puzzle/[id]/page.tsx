import { api } from "@/trpc/server";

type PuzzleProps = {
  params: {
    id: string;
  };
};

export default async function Puzzle({ params: { id } }: PuzzleProps) {
  const puzzle = await api.puzzle.get.query(id);
  console.log(puzzle);
  return <div>Puzzle page</div>;
}
