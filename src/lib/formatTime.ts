import intervalToDuration from "date-fns/intervalToDuration";

export const formatDuration = (ms: number) => {
  const duration = intervalToDuration({ start: 0, end: ms });

  const zeroPad = (num: number | undefined) => String(num).padStart(2, "0");

  return [duration.hours, duration.minutes, duration.seconds]
    .filter(Boolean)
    .map(zeroPad)
    .join(":");
};
