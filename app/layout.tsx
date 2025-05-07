import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import DownloadAppPopup from "@/components/download-app-popup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BioDuel",
  description: "A strategic card game about biodiversity",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  manifest: "/manifest.json",
  themeColor: "#34d399",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BioDuel",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Inline the PWA registration script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // PWA Registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }

              // Handle install prompt
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                console.log('Install prompt ready');
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full overflow-hidden`}>
        <AuthProvider>{children}</AuthProvider>
        <DownloadAppPopup />
      </body>
    </html>
  )
}
