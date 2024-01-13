"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Timer = {
  startTime: number;
  endTime: number | null;
  setEndTime: (time: number) => void;
};

const TimerContext = createContext<Timer | null>(null);

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  return (
    <TimerContext.Provider value={{ startTime, endTime, setEndTime }}>
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
