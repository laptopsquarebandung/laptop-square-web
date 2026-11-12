import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LAPTOP SQUARE | Pusat Laptop Resmi Istana BEC Bandung",
  description: "Pusat laptop baru terlengkap di Istana BEC Lantai 1 Blok H16 Bandung. Jual laptop ASUS, Lenovo, HP, Acer, Apple, MSI dengan 100% garansi resmi, promo cicilan 0%, dan bonus software siap pakai.",
  keywords: [
    "laptop square bec",
    "laptop bandung",
    "toko laptop istana bec",
    "laptop asus bandung",
    "laptop lenovo bandung",
    "laptop gaming bandung",
    "cicilan laptop 0 bandung"
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
