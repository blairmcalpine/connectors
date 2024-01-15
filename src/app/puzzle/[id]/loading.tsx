import { Header } from "@components/Header";

const Loading = () => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header title="" />
      <main className="relative flex flex-grow items-center justify-center">
        <PuzzleSkeleton />
      </main>
    </div>
  );
};

export default Loading;

const PuzzleSkeleton = () => {
  return (
    <div className="relative w-full px-1">
      <div className="flex flex-col items-center gap-6">
        <div className="grid aspect-square w-full max-w-[624px] grid-cols-4 grid-rows-4 flex-col md:aspect-auto md:h-[344px]">
          {Array.from(Array(16)).map((_, idx) => (
            <div key={idx} className="p-1">
              <button
                className="h-full w-full break-words rounded-md bg-gray text-center text-xl font-bold uppercase transition-transform ease-in-out placeholder:text-white focus:outline-none active:scale-90 dark:text-black"
                disabled
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span>Mistakes remaining: </span>
          <div className="flex w-24 items-center gap-2.5">
            {Array.from(Array(4)).map((_, idx) => (
              <div
                key={idx}
                className="h-4 w-4 rounded-full bg-dark-gray transition-transform duration-300 dark:bg-gray"
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 dark:border-white"
            disabled
          >
            Shuffle
          </button>
          <button
            className="flex justify-center rounded-full border border-black px-4 py-3 dark:border-white"
            disabled
          >
            Deselect All
          </button>
          <button
            className="flex justify-center rounded-full border bg-black px-4 py-3 text-white disabled:border-disabled-gray disabled:bg-white disabled:text-disabled-gray dark:bg-white dark:text-black dark:disabled:bg-black"
            disabled
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
