import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Finance Tracker",
  description: "A personal finance management application built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["Finance", "Tracker", "Next.js", "TypeScript", "Tailwind CSS", "React"],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "My Finance Tracker",
    description: "Personal finance management app",
    siteName: "My Finance Tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Finance Tracker",
    description: "Personal finance management app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
