import { useCallback } from "react";
import toast from "react-hot-toast";

export const useNativeShare = (text: string) => {
  const share = useCallback(() => {
    let nativeSuccess = true;
    toast(typeof navigator.share)
    if (typeof navigator.share === "function") {
      void navigator.share({ text, title: "Test title", url: "http://localhost:3000/yep" }).catch((e: unknown) => {
        toast(JSON.stringify(e))
        nativeSuccess = false;
      });
    } else {
      nativeSuccess = false;
    }
    if (!nativeSuccess && typeof navigator.clipboard?.writeText === "function") {
      void navigator.clipboard?.writeText(text)?.then(() => toast("Copied to clipboard"));
    }
  }, [text]);
  return share;
};
