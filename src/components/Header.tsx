import format from "date-fns/format";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex flex-col items-center gap-4 border-b py-12 md:flex-row md:items-end md:py-16 md:pl-24">
      <h1 className="text-5xl font-bold">{title}</h1>
      <h2 className="text-3xl font-light">
        {format(new Date(), "MMMM d, yyyy")}
      </h2>
    </header>
  );
}
