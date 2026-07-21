import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { FitnessProvider } from "@/context/FitnessContext";
import { JsonLdSchema } from "@/components/JsonLdSchema";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harifitness.com";

export const viewport: Viewport = {
  themeColor: "#FF1E1E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "HARI FITNESS | Personal Training & Body Transformation OS",
    template: "%s | HARI FITNESS"
  },
  description: "Transform your physique with Coach Hari. Customized scientific workout routines, nutrition macro tracking, daily food snap logs, and 1-on-1 personal coaching.",
  keywords: [
    "Personal Trainer",
    "Coach Hari",
    "Hari Fitness",
    "Powerlifting Coach",
    "Muscle Gain Program",
    "Fat Loss Diet",
    "Hypertrophy Specialist",
    "Fitness Dashboard",
    "Nutrition Snap Tracker"
  ],
  authors: [{ name: "Coach Hari", url: baseUrl }],
  creator: "Coach Hari",
  publisher: "Hari Fitness",
  applicationName: "Hari Fitness OS",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Hari Fitness",
    title: "HARI FITNESS | Personal Training & Body Transformation OS",
    description: "Train smarter, eat better, and build your best physique with Coach Hari. Includes personal coaching, nutrition tracking, and active workout logs.",
    images: [
      {
        url: `${baseUrl}/images/transformations/trainer-after.jpg`,
        width: 1200,
        height: 630,
        alt: "Coach Hari Powerlifting & Personal Training Transformation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HARI FITNESS | Personal Training & Body Transformation OS",
    description: "Transform your physique with Coach Hari. Scientific workout routines, macro tracking, and personal accountability.",
    images: [`${baseUrl}/images/transformations/trainer-after.jpg`],
    creator: "@harifitness",
  },
  verification: {
    google: "google-site-verification-token",
  },
  category: "Health & Fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <head>
        <JsonLdSchema />
      </head>
      <body className="min-h-full bg-brand-bg text-white relative">
        <FitnessProvider>
          {/* Cyber Environment Background Layers */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* Layer 1: Dark base gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,13,0.8),rgba(5,5,5,1))]" />
            
            {/* Layer 2: Red glowing corner lights */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent-sec/15 rounded-full blur-[120px]" />
            
            {/* Layer 3: Cyber grid overlay */}
            <div className="absolute inset-0 bg-grid-cyber opacity-60" />
            
            {/* Layer 4: Soft fog / vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(5,5,5,0.9)_95%)]" />

            {/* Layer 5: Horizontal Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.005),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] opacity-20" />
          </div>

          {/* Main Website Wrapper */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </FitnessProvider>
      </body>
    </html>
  );
}
