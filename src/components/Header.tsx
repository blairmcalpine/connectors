import { Timer } from "@components/Timer";
import format from "date-fns/format";

type HeaderProps = {
  title: string;
  timer?: boolean;
};

export const Header = ({ title, timer }: HeaderProps) => {
  return (
    <header className="flex flex-col items-center gap-4 border-b py-8 md:flex-row md:items-end md:justify-between md:gap-0 md:px-24 md:py-16">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
        <h1 className="text-center text-5xl font-bold">{title}</h1>
        <h2 className="text-3xl font-light">
          {format(new Date(), "MMMM d, yyyy")}
        </h2>
      </div>
      {timer && <Timer />}
    </header>
  );
};
