import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perch — a shared map of good places to stop",
    template: "%s · Perch",
  },
  description:
    "A bench with the whole city in it. A flat rock above the cloud. Someone marks it with a photo, and everyone else gets to sit there too.",
  icons: { icon: "/logo.webp", apple: "/logo.webp" },
  openGraph: {
    type: "website",
    siteName: "Perch",
    title: "Perch — a shared map of good places to stop",
    description:
      "Somebody already found the good spot. Perch is where they wrote it down.",
    images: [{ url: "/hero-overlook.webp", width: 2752, height: 1536 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perch — a shared map of good places to stop",
    description:
      "Somebody already found the good spot. Perch is where they wrote it down.",
    images: ["/hero-overlook.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1613" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* SOFT and WONK must be requested explicitly, or the
            font-variation-settings in globals.css silently do nothing. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..700,0..100,0..1&family=Instrument+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
