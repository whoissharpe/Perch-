import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perch — every good place to sit down",
    template: "%s · Perch",
  },
  description:
    "A map of the world's benches: the ones with the view, the shade and the quiet. Seeded from open data, finished by the people who actually sat there.",
  openGraph: {
    type: "website",
    siteName: "Perch",
    title: "Perch — every good place to sit down",
    description:
      "A map of the world's benches: the ones with the view, the shade and the quiet.",
    images: [{ url: "/hero-overlook.webp", width: 2752, height: 1536 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perch — every good place to sit down",
    description:
      "A map of the world's benches: the ones with the view, the shade and the quiet.",
    images: ["/hero-overlook.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f4" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
