import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "LaptopSquare — Pusat Laptop Resmi & Flagship Istana BEC Bandung",
  description:
    "Kurasi laptop flagship, workstation kreatif, gaming RTX, dan ultrabook generasi terbaru di Istana BEC Lantai 1 Blok H16 Bandung. Garansi resmi 100%, cicilan 0%, pengiriman berasuransi.",
  keywords: [
    "laptopsquare",
    "laptop square bec",
    "toko laptop bandung",
    "laptop resmi istana bec",
    "laptop gaming bandung",
    "ultrabook bandung",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
