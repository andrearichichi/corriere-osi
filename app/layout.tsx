import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Il Filo · Corriere Giochi — Case study",
  description:
    "Strategia, prototipo e Growth Lab per aumentare i giocatori quotidiani di Corriere Giochi. Proposta per il case study di novembre 2026.",
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
