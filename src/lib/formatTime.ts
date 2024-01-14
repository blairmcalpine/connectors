import intervalToDuration from "date-fns/intervalToDuration";

export const formatDuration = (ms: number) => {
  const duration = intervalToDuration({ start: 0, end: ms });

  const zeroPad = (num: number | undefined) => String(num).padStart(2, "0");

  const units = [duration.minutes, duration.seconds];
  if (duration.hours) units.unshift(duration.hours);

  return units.map(zeroPad).join(":");
};
