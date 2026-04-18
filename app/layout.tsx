import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import AIChatbot from "./components/AIChatbot";
import { CartProvider } from "./CartContext";
import CustomCursor from "./components/CustomCursor";
import { SITE_PROFILE } from "@/lib/siteProfile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${SITE_PROFILE.brandName} | Jewelry E-commerce`,
  description: SITE_PROFILE.tagline,
  icons: {
    icon: '/vercel.svg',
  },
  openGraph: {
    title: `${SITE_PROFILE.brandName} | Jewelry E-commerce`,
    description: SITE_PROFILE.tagline,
    type: 'website',
    locale: 'en_US',
    url: 'https://jewelry-store.vercel.app',
    siteName: SITE_PROFILE.brandName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_PROFILE.brandName} | Jewelry E-commerce`,
    description: SITE_PROFILE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased font-inter" suppressHydrationWarning>
        <CartProvider>
          <CustomCursor />
          {children}
          <Script
  src="http://192.168.0.102:3000/widget.js"
  data-widget-key="wk_0db9e6b5c8990d04f9e5d0cfc9a4d4ae"
  data-backend-url="http://192.168.0.102:3000"
  
></Script>
          <AIChatbot />
        </CartProvider>
      </body>
    </html>
  );
}
