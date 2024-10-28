import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from '@vercel/speed-insights/next';


const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "GostlyNotes";
const APP_DEFAULT_TITLE = "Send and recieve anonymus messages!";
const APP_TITLE_TEMPLATE = "%s - GostlyNotes App";
const APP_DESCRIPTION = "Speak freely, share boldly";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
        <SpeedInsights />
      <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
