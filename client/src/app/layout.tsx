import "./globals.css";

import { Inter } from "next/font/google"; // Import the Inter font
import StoreProvider from "@/lib/store/store-provider";

const inter = Inter({ subsets: ["latin"] }); // Define inter before using

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
