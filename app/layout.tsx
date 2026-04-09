import type { Metadata } from "next";
import { publicSans, robotoMono } from "@/lib/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: "JOYCO | Containers",
  description: "All possible container variants and it's differences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${robotoMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
