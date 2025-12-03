import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SmartPrints UK – AI Educational Activities for Kids | Worksheets, Colouring Pages & More",
    template: "%s | SmartPrints UK",
  },
  description: "Create personalised educational worksheets, colouring pages, mazes & word searches for your children in seconds. Aligned with UK curriculum (EYFS, KS1, KS2). Free to try!",
  keywords: [
    "educational worksheets UK",
    "printable activities for kids",
    "colouring pages children",
    "KS1 worksheets",
    "KS2 activities",
    "EYFS resources",
    "homeschool UK",
    "learning activities children",
    "AI educational content",
    "personalised worksheets",
    "free printable worksheets",
    "kids activities UK",
  ],
  authors: [{ name: "SmartPrints UK" }],
  creator: "SmartPrints UK",
  publisher: "SmartPrints UK",
  metadataBase: new URL("https://smartprints.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://smartprints.uk",
    siteName: "SmartPrints UK",
    title: "SmartPrints UK – AI Educational Activities for Kids",
    description: "Create personalised educational worksheets, colouring pages, mazes & word searches for your children in seconds. Free to try!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartPrints UK - AI Educational Activities for Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPrints UK – AI Educational Activities for Kids",
    description: "Create personalised educational worksheets, colouring pages, mazes & word searches in seconds. Free to try!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here later
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en-GB" style={{ colorScheme: 'light' }} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="theme-color" content="#4f46e5" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
