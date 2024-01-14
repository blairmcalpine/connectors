import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { CustomToaster } from "@components/CustomToaster";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Connectors",
  description: "Created by Blair McAlpine",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} dark:bg-black dark:text-white`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
        <CustomToaster />
      </body>
    </html>
  );
};

export default RootLayout;
