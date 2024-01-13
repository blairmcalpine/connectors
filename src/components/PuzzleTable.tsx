import type { Puzzle, PuzzleCompletion } from "@prisma/client";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import Link from "next/link";

type PuzzleTableProps = {
  puzzles: (Puzzle & { completions: PuzzleCompletion[] })[];
  plays?: boolean;
};

export const PuzzleTable = ({ puzzles, plays }: PuzzleTableProps) => {
  return (
    <table className="mx-2 w-full max-w-[624px]">
      <thead>
        <tr className="border-b border-disabled-gray">
          <th className="h-12 text-left text-2xl font-semibold text-disabled-gray">
            Puzzle Name
          </th>
          {plays && (
            <th className="h-12 text-left text-2xl font-semibold text-disabled-gray">
              Plays
            </th>
          )}
          <th className="h-12 text-right text-2xl font-semibold text-disabled-gray">
            Created
          </th>
        </tr>
      </thead>
      <tbody>
        {puzzles.map((puzzle, idx) => (
          <PuzzlePreview puzzle={puzzle} key={idx} plays={plays} />
        ))}
      </tbody>
    </table>
  );
};

type PuzzlePreviewProps = {
  puzzle: Puzzle & { completions: PuzzleCompletion[] };
  plays?: boolean;
};

const PuzzlePreview = ({ puzzle, plays }: PuzzlePreviewProps) => {
  return (
    <tr className="border-b border-disabled-gray py-4 text-2xl transition-colors last:border-b-0 hover:bg-white hover:bg-opacity-10">
      <td className="flex h-12 items-center">
        <Link href={`/puzzle/${puzzle.readableId}`} className="w-full">
          {puzzle.name}
        </Link>
      </td>
      {plays && <td className="h-12">{puzzle.completions.length}</td>}
      <td className="h-12 text-right">
        {formatDistanceToNowStrict(puzzle.createdAt)} ago
      </td>
    </tr>
  );
};
