// import "./globals.css";

// import { Inter } from "next/font/google"; // Import the Inter font
// import StoreProvider from "@/lib/store/store-provider";

// const inter = Inter({ subsets: ["latin"] }); // Define inter before using

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <StoreProvider>{children}</StoreProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/store/store-provider";
import SessionProvider from "@/lib/provider/session-provider";
import { getServerSession } from "next-auth";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "@/lib/provider/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-Clone",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ReactQueryProvider>
          <StoreProvider>
            <SessionProvider session={session}>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
              />
              {children}
            </SessionProvider>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}