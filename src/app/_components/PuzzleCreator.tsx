"use client";

import { api } from "@/trpc/react";
import {
  difficultyArray,
  difficultyToColor,
  type Difficulty,
} from "@lib/difficulty";
import { useState } from "react";
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
  categoryIdx: number;
};

type Category = {
  description: string;
  difficulty: Difficulty;
  words: string[];
};

type Puzzle = {
  categories: Category[];
  name: string;
};

const defaultValues: Puzzle = {
  name: "",
  categories: difficultyArray.map((difficulty) => ({
    description: "",
    difficulty,
    words: difficultyArray.map(() => ""),
  })),
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

export function PuzzleCreator() {
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
  const { mutate } = api.puzzle.create.useMutation();

  return (
    <FormProvider {...methods}>
      <form
        className="flex w-[624px] flex-col items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className={`h-20 w-full rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none ${
            errors.name && "border-4 border-red-600"
          }`}
          placeholder="Puzzle Name"
          {...register("name", {
            required: {
              value: true,
              message: "Please give your puzzle a title.",
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
            categoryIdx={idx}
          />
        ))}
        <p className="font-bold text-red-600">
          {getFirstError(errors) || "\u00a0"}
        </p>
        <button
          type="submit"
          className="text-md flex w-40 justify-center rounded-full bg-black py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}

function CreateCategory({
  difficulty,
  open,
  onClick,
  categoryIdx,
}: CreateCategoryProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Puzzle>();
  return (
    <div className="flex flex-col">
      <button
        className={`bg-${
          difficultyToColor[difficulty]
        } h-20 rounded-md text-xl font-bold text-white ${
          errors.categories?.[categoryIdx] ? "border-4 border-red-600" : ""
        }`}
        onClick={onClick}
        type="button"
      >
        Create {difficulty} Category
      </button>
      <div
        className={`overflow-hidden ${
          open ? "h-[176px]" : "h-0"
        } transition-all duration-500 ease-in-out`}
      >
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex h-20 gap-2">
            {difficultyArray.map((_, wordIdx) => (
              <input
                key={wordIdx}
                className={`w-full rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none ${
                  errors.categories?.[categoryIdx]?.words?.[wordIdx] &&
                  "border-4 border-red-600"
                }`}
                placeholder={`Word ${wordIdx + 1}`}
                {...register(`categories.${categoryIdx}.words.${wordIdx}`, {
                  required: {
                    value: true,
                    message: `Please fill out word ${
                      wordIdx + 1
                    } in the ${difficulty} category.`,
                  },
                })}
                maxLength={20}
              />
            ))}
          </div>
          <input
            className={`h-20 rounded-md bg-gray text-center text-xl font-bold uppercase placeholder:text-white focus:outline-none ${
              errors.categories?.[categoryIdx]?.description &&
              "border-4 border-red-600"
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
}
