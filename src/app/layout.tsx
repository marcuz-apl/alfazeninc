import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global AI Solutions for Oil & Gas - Alfazen Inc.",
  description: "With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
