import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "beatronome: no bs drum machine",
  description: "A fast, easy, no-bs online drum machine and metronome. Create beats and keep time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ background: '#b3d8f7', color: '#000' }}>
        {children}
      </body>
    </html>
  );
}
