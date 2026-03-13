import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kankyò",
  description: "A sonic journey through immersive Japanese urban landscapes.",
  authors: [
    {
      name: "tèkh studio",
      url: "https://tekh.studio",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-dvw h-dvh ">
      <body
        className={`${jetBrainsMono.variable} antialiased w-full h-full font-mono overflow-hidden bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
