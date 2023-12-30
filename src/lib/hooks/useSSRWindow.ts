type SSRWindow =
  | {
      window: Window & typeof globalThis;
      isSSR: false;
    }
  | {
      window: undefined;
      isSSR: true;
    };

export const useSSRWindow = (): SSRWindow => {
  const isSSR = typeof window === "undefined";
  if (isSSR) {
    return { window: undefined, isSSR };
  } else {
    return { window, isSSR };
  }
};
