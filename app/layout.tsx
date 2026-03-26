import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/src/context/AuthContext";
import { NatureSoundProvider } from "@/src/context/NatureSoundContext";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import FloatingPetals from "@/src/components/FloatingPetals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MySafePlace",
  description: "A safe space for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NatureSoundProvider>
            <FloatingPetals />
            {children}
            <Analytics />
          </NatureSoundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
