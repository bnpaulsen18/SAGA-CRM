import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Bricolage_Grotesque, Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import CookieConsentBanner from "@/components/consent/CookieConsentBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAGA CRM - Nonprofit Donor Management & Fundraising Platform",
    template: "%s | SAGA CRM",
  },
  description:
    "Modern CRM built for nonprofits. Manage donors, track donations, run campaigns, and grow your mission. Simple, powerful, and free to start.",
  keywords: [
    "nonprofit CRM",
    "donor management",
    "fundraising software",
    "donation tracking",
    "nonprofit software",
    "charity CRM",
    "fundraising platform",
    "donor database",
  ],
  authors: [{ name: "SAGA CRM" }],
  creator: "SAGA CRM",
  publisher: "SAGA CRM",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://saga-crm.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SAGA CRM",
    title: "SAGA CRM - Nonprofit Donor Management Platform",
    description:
      "Modern CRM built for nonprofits. Manage donors, track donations, run campaigns, and grow your mission.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SAGA CRM - Nonprofit Donor Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAGA CRM - Nonprofit Donor Management Platform",
    description:
      "Modern CRM built for nonprofits. Manage donors, track donations, run campaigns, and grow your mission.",
    images: ["/twitter-image.png"],
    creator: "@sagacrm", // Update this with your actual Twitter/X handle before launch
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
    google: "", // TODO: Add Google Search Console verification
    // yandex: "", // Optional: Add Yandex verification
    // bing: "", // Optional: Add Bing verification
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <OrganizationStructuredData />
          <WebSiteStructuredData />
          <SessionProvider>
            {children}
          </SessionProvider>
          <CookieConsentBanner />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
