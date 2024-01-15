import { Header } from "@components/Header";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title="Connectors" />
      <main className="flex flex-grow flex-col items-center justify-center gap-6">
        <Link
          className="text-md flex w-40 justify-center rounded-full bg-black py-3 text-white dark:bg-white dark:text-black"
          href="/create"
        >
          Create a Puzzle
        </Link>
        <Link
          className="text-md flex w-40 justify-center rounded-full border border-black py-3 dark:border-white dark:text-white"
          href="/popular"
        >
          Popular Puzzles
        </Link>
        <Link
          className="text-md flex w-40 justify-center rounded-full border border-black py-3 dark:border-white dark:text-white"
          href="/recent"
        >
          Recently Created
        </Link>
      </main>
    </div>
  );
};

export default Home;
