"use client";

import { api } from "@/trpc/react";
import {
  difficultyArray,
  difficultyToColor,
  type Difficulty,
} from "@lib/difficulty";
import { useNativeShare } from "@lib/hooks/useNativeShare";
import { useSSRWindow } from "@lib/hooks/useSSRWindow";
import type { Puzzle } from "@lib/puzzle";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";

type CreateCategoryProps = {
  difficulty: Difficulty;
  open: boolean;
  onClick: () => void;
  onFocus: () => void;
  categoryIdx: number;
};

const defaultValues: Puzzle = {
  name: "",
  categories: difficultyArray.map((difficulty) => ({
    description: "",
    difficulty,
    words: difficultyArray.map(() => ""),
  })),
  words: difficultyArray.flatMap((difficulty) =>
    difficultyArray.map(() => ({ difficulty, word: "", id: "", puzzleId: "" })),
  ),
};

const getFirstError = (errors: unknown): string => {
  if (!errors || typeof errors !== "object") return "";
  const errorArray: unknown[] = Array.isArray(errors)
    ? errors
    : Object.values(errors);
  for (const error of errorArray) {
    if (error && typeof error === "object") {
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
      return getFirstError(error);
    }
  }
  return "";
};

export const PuzzleCreator = () => {
  const [open, setOpen] = useState<Difficulty | null>(null);
  const methods = useForm<Puzzle>({
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<Puzzle> = (data) => {
    mutate(data);
  };
  const { mutate, data, isLoading } = api.puzzle.create.useMutation();
  const { window } = useSSRWindow();
  const { share, copyToClipboard } = useNativeShare(
    `${window?.location.origin}/puzzle/${data?.id}`,
  );

  if (data) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold">
          Your Puzzle Has Been Created!
        </h1>
        <p className="text-xl">{data.name}</p>
        <div className="flex flex-col gap-4 md:flex-row">
          <button
            className="flex w-40 justify-center rounded-full border border-black py-3 active:bg-gray dark:border-white"
            onClick={copyToClipboard}
          >
            Copy Link
          </button>
          <button
            className="flex w-40 justify-center rounded-full border border-black py-3 active:bg-gray dark:border-white"
            onClick={share}
          >
            Share
          </button>
          <Link
            href={`/puzzle/${data.id}`}
            className="flex w-40 justify-center rounded-full bg-black py-3 text-white dark:bg-white dark:text-black"
          >
            Try It Out
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex w-full max-w-[624px] flex-col items-center gap-2 p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className={`h-20 w-full rounded-md bg-gray text-center text-xl font-bold placeholder:text-white focus:outline-none dark:text-black ${
            errors.name && "border-4 border-red-400"
          }`}
          placeholder="Puzzle Name"
          {...register("name", {
            required: {
              value: true,
              message: "Please give your puzzle a name.",
            },
          })}
        />
        {difficultyArray.map((difficulty, idx) => (
          <CreateCategory
            difficulty={difficulty}
            key={difficulty}
            open={open === difficulty}
            onClick={() =>
              open === difficulty ? setOpen(null) : setOpen(difficulty)
            }
            onFocus={() => setOpen(difficulty)}
            categoryIdx={idx}
          />
        ))}
        <p className="font-bold text-red-400">
          {getFirstError(errors) || "\u00a0"}
        </p>
        <button
          type="submit"
          className="flex w-40 justify-center rounded-full bg-black py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          disabled={Boolean(isLoading || Object.keys(errors).length)}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </FormProvider>
  );
};

const CreateCategory = ({
  difficulty,
  open,
  onClick,
  onFocus,
  categoryIdx,
}: CreateCategoryProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<Puzzle>();
  const difficultyDescription = watch(
    `categories.${categoryIdx}.description`,
  ).toUpperCase();
  const wordsObjs = watch(`words`).slice(
    categoryIdx * difficultyArray.length,
    (categoryIdx + 1) * difficultyArray.length,
  );
  const words = useMemo(
    () =>
      wordsObjs
        .map(({ word }) => word)
        .filter((word) => word)
        .join(", "),
    [wordsObjs],
  );
  return (
    <div className="flex flex-col">
      <button
        className={`bg-${
          difficultyToColor[difficulty]
        } flex h-20 flex-col items-center justify-center rounded-md text-xl text-white ${
          errors.categories?.[categoryIdx] ? "border-4 border-red-400" : ""
        }`}
        onClick={onClick}
        type="button"
      >
        <span className="font-bold">
          {difficultyDescription
            ? difficultyDescription.toUpperCase()
            : `Create ${difficulty} Category`}
        </span>
        {words && <span className="uppercase">{words}</span>}
      </button>
      <div
        className={`overflow-hidden ${
          open ? "h-[176px]" : "h-0"
        } transition-all duration-500 ease-in-out`}
      >
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex h-20 gap-2">
            {difficultyArray.map((_, idx) => {
              const wordIdx = categoryIdx * difficultyArray.length + idx;
              return (
                <input
                  key={idx}
                  className={`w-full rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none dark:text-black ${
                    errors.words?.[wordIdx] && "border-4 border-red-400"
                  }`}
                  placeholder={`Word ${idx + 1}`}
                  {...register(`words.${wordIdx}.word`, {
                    required: {
                      value: true,
                      message: `Please fill out word ${
                        idx + 1
                      } in the ${difficulty} category.`,
                    },
                  })}
                  maxLength={20}
                  onFocus={onFocus}
                />
              );
            })}
          </div>
          <input
            className={`h-20 rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none dark:text-black ${
              errors.categories?.[categoryIdx]?.description &&
              "border-4 border-red-400"
            }`}
            placeholder="Category Name"
            {...register(`categories.${categoryIdx}.description`, {
              required: {
                value: true,
                message: `Please give the ${difficulty} category a description.`,
              },
            })}
            maxLength={40}
          />
        </div>
      </div>
    </div>
  );
};
