import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-director",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinema Scroll | Next.js 16 & GSAP",
  description: "Cinema Text Infinite Scroll with Next.js 16, Tailwind CSS, and GSAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="h-full w-full bg-black text-white overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
