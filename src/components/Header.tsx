import format from "date-fns/format";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="border-gray-300 flex md:flex-row flex-col md:items-end items-center gap-4 border-b md:py-16 py-12 md:pl-24">
      <h1 className="text-5xl font-bold">{title}</h1>
      <h2 className="text-3xl font-light">
        {format(new Date(), "MMMM d, yyyy")}
      </h2>
    </header>
  );
}
