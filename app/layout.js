import { Geist, Geist_Mono, Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const googleSans = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "CarrierPatch",
  description: "For Internet Carriers, By Internet Carriers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body className={inter.className}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
