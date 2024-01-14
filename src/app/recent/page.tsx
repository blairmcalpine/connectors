import { api } from "@/trpc/server";
import { Header } from "@components/Header";
import type { Puzzle } from "@prisma/client";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import Link from "next/link";

export const metadata = {
  title: "Recently Created Puzzles - Connectors",
};

const Recent = async () => {
  const puzzles = await api.puzzle.recent.query();
  return (
    <div className="flex min-h-[100dvh] flex-col gap-4">
      <Header title="Recently Created Puzzles" />
      <main className="flex justify-center">
        <table className="mx-2 w-full max-w-[624px]">
          <thead>
            <tr className="border-b border-disabled-gray">
              <th className="h-12 text-left text-2xl font-semibold text-disabled-gray">
                Puzzle Name
              </th>
              <th className="h-12 text-right text-2xl font-semibold text-disabled-gray">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {puzzles.map((puzzle, idx) => (
              <PuzzlePreview puzzle={puzzle} key={idx} />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Recent;

type PuzzlePreviewProps = {
  puzzle: Puzzle;
};

const PuzzlePreview = ({ puzzle }: PuzzlePreviewProps) => {
  return (
    <tr className="border-b border-disabled-gray py-4 text-2xl transition-colors last:border-b-0 hover:bg-[rgb(230,230,230)] dark:hover:bg-[rgb(26,26,26)]">
      <td className="flex h-12 items-center">
        <Link href={`/puzzle/${puzzle.readableId}`} className="w-full">
          {puzzle.name}
        </Link>
      </td>
      <td className="h-12 text-right">
        {formatDistanceToNowStrict(puzzle.createdAt)} ago
      </td>
    </tr>
  );
};
