"use client";

import { api } from "@/trpc/react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Timer = {
  startTime: number;
  completionTime: number | null;
  setEndTime: (time: number) => void;
};

const TimerContext = createContext<Timer | null>(null);

type TimerContextProviderProps = {
  children: ReactNode;
  puzzleId: string;
};

export const TimerContextProvider = ({
  children,
  puzzleId,
}: TimerContextProviderProps) => {
  const [startTime] = useState(() => Date.now());
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const { mutate } = api.puzzle.completion.useMutation();
  const setEndTime = useCallback(
    (time: number) => {
      setCompletionTime(time - startTime);
      mutate({ time: time - startTime, puzzleId });
    },
    [mutate, puzzleId, startTime],
  );
  return (
    <TimerContext.Provider value={{ startTime, completionTime, setEndTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const timerContext = useContext(TimerContext);
  if (!timerContext) {
    throw new Error("useTimer must be used within a TimerContextProvider");
  }
  return timerContext;
};
