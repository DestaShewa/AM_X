import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AMX — Arba Minch Experiences",
  description: "AMX application foundation",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
