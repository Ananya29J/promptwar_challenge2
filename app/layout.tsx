import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import ChatAssistant from "@/components/ChatAssistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoteWise — Your AI Election Guide",
  description:
    "Transform your understanding of elections with VoteWise — an AI-powered, gamified guide to voting, registration, and civic participation in India.",
  keywords: ["election guide", "voting assistant", "India elections", "voter registration", "civic education", "AI"],
  authors: [{ name: "VoteWise Team" }],
  openGraph: {
    title: "VoteWise — Your AI Election Guide",
    description: "AI-powered, gamified guide to Indian elections and civic participation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F8F9FA" />
      </head>
      <body>


        {/* Custom cursor (desktop only) */}
        <Cursor />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main id="main-content" style={{ position: "relative", zIndex: 1, paddingTop: "72px" }}>
          {children}
        </main>

        {/* Floating AI Chat */}
        <ChatAssistant />
      </body>
    </html>
  );
}
