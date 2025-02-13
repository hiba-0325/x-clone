"use client";

import './globals.css'
import { Provider } from "react-redux";
// import { SessionProvider } from "next-auth/react";
import { store } from "@/lib/store/store";
import { Inter } from "next/font/google"; // Import the Inter font

const inter = Inter({ subsets: ["latin"] }); // Define inter before using

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SessionProvider> */}
          <Provider store={store}>{children}</Provider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
