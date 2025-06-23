import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MS Motor - Premium Car Listings",
  description: "Find your perfect car from our extensive collection of premium vehicles. Browse, compare, and buy with confidence.",
  keywords: "cars, car listings, buy cars, sell cars, automotive, vehicles",
  authors: [{ name: "MS Motor" }],
  creator: "MS Motor",
  publisher: "MS Motor",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "MS Motor",
    title: "MS Motor - Premium Car Listings",
    description: "Find your perfect car from our extensive collection of premium vehicles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MS Motor - Premium Car Listings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MS Motor - Premium Car Listings",
    description: "Find your perfect car from our extensive collection of premium vehicles.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ToastProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
