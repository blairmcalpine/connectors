"use client";
import { formatDuration } from "@lib/formatTime";
import { useTimer } from "@lib/hooks/useTimer";
import { useEffect, useMemo, useRef, useState } from "react";

export const Timer = () => {
  const [delta, setDelta] = useState(0);
  const { startTime, endTime } = useTimer();
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const formattedTime = useMemo(() => formatDuration(delta), [delta]);
  useEffect(() => {
    const id = setInterval(() => {
      setDelta(Date.now() - startTime);
    }, 1000);
    intervalId.current = id;
    return () => clearInterval(id);
  }, [startTime]);

  useEffect(() => {
    if (endTime) {
      clearInterval(intervalId.current);
      setDelta(endTime - startTime);
    }
  }, [endTime, startTime]);

  return <span className="text-3xl font-light">{formattedTime}</span>;
};
