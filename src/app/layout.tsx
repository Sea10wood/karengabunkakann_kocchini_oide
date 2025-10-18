import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP, Creepster } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  display: "swap",
});

const creepster = Creepster({
  variable: "--font-creepster",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "赤煉瓦文化館~こっちにおいで~",
  description: "赤煉瓦文化館~こっちにおいで~",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "赤煉瓦文化館~こっちにおいで~",
    description: "赤煉瓦文化館~こっちにおいで~",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "呼び声",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "赤煉瓦文化館~こっちにおいで~",
    description: "赤煉瓦文化館~こっちにおいで~",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJp.variable} ${creepster.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
