import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facundo's Posts",
  description: "A collection of posts by Facundo on AI, software engineering, and technology.",
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
