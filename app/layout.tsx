import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroAnimation } from "@/components/IntroAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026 World Cup Pool — Live Scoreboard",
  description:
    "Live standings for our 2026 World Cup pool. Scores update automatically from live match results.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <IntroAnimation />
        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-4">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
