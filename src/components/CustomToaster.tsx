"use client";

import { Toaster } from "react-hot-toast";

export const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{ duration: 2000 }}
      containerClassName="mt-20"
    >
      {({ message, ariaProps, visible }) => (
        <div
          className={`rounded-md bg-black p-3 text-lg text-white dark:bg-white dark:text-black ${
            visible ? "animate-fade-in" : "animate-fade-out"
          }`}
          {...ariaProps}
        >
          {message as string}
        </div>
      )}
    </Toaster>
  );
};
