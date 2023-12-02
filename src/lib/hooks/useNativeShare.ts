import { useCallback } from "react";
import toast from "react-hot-toast";

export const useNativeShare = (text: string) => {
  const share = useCallback(() => {
    let nativeSuccess = true;
    if (typeof navigator.share === "function") {
      void navigator.share({ text }).catch(() => {
        nativeSuccess = false;
      });
    } else {
      nativeSuccess = false;
    }
    if (!nativeSuccess) {
      void navigator.clipboard
        .writeText(text)
        .then(() => toast("Copied to clipboard"));
    }
  }, [text]);
  return share;
};
