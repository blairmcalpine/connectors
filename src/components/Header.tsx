import { Timer } from "@components/Timer";
import format from "date-fns/format";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  title: string;
  timer?: boolean;
};

export const Header = ({ title, timer }: HeaderProps) => {
  return (
    <header className="flex flex-col items-center gap-4 border-b py-4 md:flex-row md:items-end md:px-24 md:py-16">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src="/connectors.png"
            alt="Connectors"
            width={48}
            height={48}
            className="w-10 md:w-12"
          />
        </Link>
        <h1 className="h-10 truncate text-center text-4xl font-bold md:h-12 md:text-5xl">
          {title}
        </h1>
      </div>
      <h2 className="hidden text-3xl font-light md:block">
        {format(new Date(), "MMMM d, yyyy")}
      </h2>
      {timer && (
        <div className="md:ml-auto">
          <Timer />
        </div>
      )}
    </header>
  );
};
