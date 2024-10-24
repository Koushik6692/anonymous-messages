import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GhostlyNotes",
  description: "Send anonymus messages to anyone!",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/images/gostlynotes.svg" />
      </head>
      <AuthProvider>
      <body className={inter.className}>
        <Navbar/>
        {children}
      <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
