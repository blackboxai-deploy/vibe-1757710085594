import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tetris Mobile - Jocul Clasic",
  description: "Jocul clasic Tetris optimizat pentru telefoane și tablete. Controale touch intuitive și design modern.",
  keywords: "tetris, joc, mobile, puzzle, clasic, romanian",
  authors: [{ name: "TetrisT Game Developer" }],
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  themeColor: "#1a1a2e",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Tetris Mobile - Jocul Clasic",
    description: "Jocul clasic Tetris optimizat pentru mobile cu controale touch",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className={`${inter.className} antialiased bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen overflow-hidden`}
        style={{ 
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {children}
      </body>
    </html>
  );
}