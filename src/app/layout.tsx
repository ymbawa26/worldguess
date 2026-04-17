import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldGuess",
  description:
    "A dark, turn-based geography duel where you and the computer race to guess each other's country.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
