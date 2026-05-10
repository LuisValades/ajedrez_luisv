import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ReinoChess — Ajedrez Mágico",
  description:
    "Aprende ajedrez jugando en el reino de Drako el dragón. Para niñas y niños de 5 años.",
  applicationName: "ReinoChess",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReinoChess",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b4423",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-MX"
      className={`${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
