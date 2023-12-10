import { Header } from "@components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title="Connectors" />
      <main className="flex flex-grow items-center justify-center bg-violet">
        <Link
          className="text-md flex w-40 justify-center rounded-full bg-black py-3 text-white"
          href="/create"
        >
          Create a Puzzle
        </Link>
        <Link href="/puzzle/GwenethDevlandIsadoratheLeekofBealsdelaysKerriGiraldoGasserand20sweetstoats">
          Special page
        </Link>
      </main>
    </div>
  );
}
