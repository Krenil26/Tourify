import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { AuthGate } from "@/components/auth-back-guard"
import "./globals.css"
import Script from "next/script"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tourifyy - AI-Powered Travel Planning",
  description:
    "Plan your dream trip with AI. Get personalized itineraries based on your budget, preferences, and travel style.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} antialiased aurora-bg min-h-screen text-foreground`}>
        <AuthGate>{children}</AuthGate>
        <Toaster />
        <Analytics />
        {/* Service Worker registration for Offline Survival Mode */}
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }`}
        </Script>
      </body>
    </html>
  )
}
