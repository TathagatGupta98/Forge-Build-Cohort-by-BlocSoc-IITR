import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Stable Coin Exchange DApp",
  description: "A decentralized application for exchanging stable coins built on Ethereum.",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
