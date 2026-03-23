import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://academiesae.com"),
  title: "Sports, Arts, Education Academy",
  description:
    "A Sports Studies program in New Brunswick providing flexible scheduling, qualified coaches, and daily training for student-athletes and artists.",
  icons: {
    icon: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
  openGraph: {
    title: "Sports, Arts, Education Academy",
    description:
      "A Sports Studies program in New Brunswick providing flexible scheduling, qualified coaches, and daily training for student-athletes and artists.",
    images: ["/logo-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${exo2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#111111] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
