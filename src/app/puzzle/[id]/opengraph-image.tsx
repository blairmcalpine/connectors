import type { PuzzlePageProps } from "@/app/puzzle/[id]/page";
import { api } from "@/trpc/server";
import { shuffle } from "@lib/shuffle";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const dynamic = "error";

// Image metadata
export const alt = "Connectors Puzzle";
export const size = {
  width: 624,
  height: 624,
};

export const contentType = "image/png";

export default async function Image({ params: { id } }: PuzzlePageProps) {
  console.log("META URL", import.meta.url);
  const interBold = fetch(
    new URL("../../../../public/Inter-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const puzzle = await api.puzzle.get.query(id);
  if (!puzzle)
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Puzzle Not Found
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: await interBold,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );
  const shuffledWords = shuffle(puzzle.words);
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {shuffledWords.map(({ word }, idx) => (
          <div
            key={idx}
            style={{
              background: "#EFEFE6",
              width: 148,
              height: 148,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              position: "absolute",
              top: Math.floor(idx / 4) * 156 + 4,
              left: (idx % 4) * 156 + 4,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {word.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
