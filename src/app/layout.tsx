import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { GitHub } from "@/icons/GitHub";
import { TRPCReactProvider } from "@/trpc/react";
import { CustomToaster } from "@components/CustomToaster";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Connectors",
  description:
    "A better version of New York Times' Connections game. Create your own puzzles and share them with others!",
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
        <Footer />
      </body>
    </html>
  );
};

const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 flex justify-center bg-inherit ">
      <a
        href="https://github.com/blairmcalpine"
        className="flex items-center justify-center gap-2"
        target="_blank"
      >
        <span>Created by Blair McAlpine</span>
        <GitHub fill="currentColor" width={18} height={18} />
      </a>
    </footer>
  );
};

export default RootLayout;
