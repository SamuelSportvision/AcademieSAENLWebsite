import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-settings";

// Site settings can change at any time from the admin, so re-fetch on every
// request rather than caching the layout statically.
export const dynamic = "force-dynamic";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://academiesae.com"),
  title: "Sports, Arts, Education Academy",
  description:
    "An Elite After-School Development Program in New Brunswick providing qualified coaches and structured weekly development for athletes and artists.",
  icons: {
    icon: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
  openGraph: {
    title: "Sports, Arts, Education Academy",
    description:
      "An Elite After-School Development Program in New Brunswick providing qualified coaches and structured weekly development for athletes and artists.",
    images: ["/logo-dark.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${exo2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#111111] text-white">
        <Navbar registrationUrl={settings.registration_url} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
