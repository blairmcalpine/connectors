export const shuffle = <T>(array: T[], startIndex = 0) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > startIndex; i--) {
    const j = Math.floor(Math.random() * (i + 1 - startIndex)) + startIndex;
    [newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!];
  }
  return newArray;
};
