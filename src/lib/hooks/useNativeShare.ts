import { useCallback } from "react";
import toast from "react-hot-toast";

export const useNativeShare = (text: string) => {
  const copyToClipboard = useCallback(() => {
    if (typeof navigator.clipboard?.writeText === "function") {
      void navigator.clipboard
        .writeText(text)
        .then(() => toast("Copied to clipboard"));
    } else {
      toast("Unable to copy to clipboard");
    }
  }, [text]);
  const share = useCallback(() => {
    if (typeof navigator.share === "function") {
      void navigator.share({ text });
    } else {
      copyToClipboard();
    }
  }, [text, copyToClipboard]);

  return { share, copyToClipboard };
};
