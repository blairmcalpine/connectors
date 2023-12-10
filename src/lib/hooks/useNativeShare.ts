import { useCallback } from "react";
import toast from "react-hot-toast";

export const useNativeShare = (text: string) => {
  const share = useCallback(() => {
    if (typeof navigator.share === "function") {
      void navigator.share({ text });
    } else if (typeof navigator.clipboard?.writeText === "function") {
      void navigator.clipboard
        .writeText(text)
        .then(() => toast("Copied to clipboard"));
    } else {
      toast("Unable to share or copy to clipboard.")
    }
  }, [text]);
  return share;
};
