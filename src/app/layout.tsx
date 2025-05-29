import type { Metadata, Viewport } from "next";
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
  title: "Shoppy Bird v2 - Modern Flappy Bird Game",
  description: "Play Shoppy Bird v2, a modern take on the classic flappy bird game. Built with Phaser 3 and Next.js. Mobile-friendly and optimized for all devices.",
  keywords: ["flappy bird", "game", "phaser", "mobile game", "shoppy bird", "browser game"],
  authors: [{ name: "Shoppy Bird Dev Team" }],
  creator: "Shoppy Bird Dev Team",
  publisher: "Shoppy Bird Dev Team",
  robots: "index, follow",
  openGraph: {
    title: "Shoppy Bird v2 - Modern Flappy Bird Game",
    description: "Play the modern take on the classic flappy bird game. Mobile-friendly and fun!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoppy Bird v2",
    description: "Modern flappy bird game - Play now!",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  category: "games",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#003366",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Mobile-specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shoppy Bird v2" />

        {/* Game-specific meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased touch-manipulation`}
        style={{
          /* Prevent pull-to-refresh on mobile */
          overscrollBehavior: 'none',
          /* Disable text selection in game */
          userSelect: 'none',
          /* Improve touch responsiveness */
          touchAction: 'manipulation',
        }}
      >
        {children}
      </body>
    </html>
  );
}
