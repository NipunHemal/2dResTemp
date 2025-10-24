import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { Poppins, Roboto } from "next/font/google";

import { ContextWrapper } from "@/context/contextWrapper";
import Provider from "@/context/Provider";
import { Toaster } from "sonner";

// const inter = Inter({ subsets: ["latin"] });

const poppinsSemi = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins-semi",
});

const poppinsbold = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-poppins-bold",
});

const poppinsreg = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins-reg",
});

const poppinsreg5 = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins-reg5",
});
const roboto400 = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-400",
});

const roboto700 = Roboto({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-roboto-700",
});

const roboto900 = Roboto({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-roboto-900",
});

export const metadata: Metadata = {
  title: "SpotMyTable Merchant | Manage Your Reservations Seamlessly",
  description:
    "SpotMyTable Merchant | Effortless table management for your restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={` ${poppinsSemi.variable} ${poppinsbold.variable} ${poppinsreg.variable} ${poppinsreg5.variable} ${roboto400.variable} ${roboto700.variable} ${roboto900.variable} `}
      lang="en"
    >
      <body>
        <Provider>
          <Providers>
            <ContextWrapper>{children}</ContextWrapper>
          </Providers>
        </Provider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
