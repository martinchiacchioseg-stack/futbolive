import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0E13",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "FutboLive — Resultados, Copas & Estadísticas en Vivo",
  description: "La experiencia futbolística definitiva en vivo. Resultados en directo, cuadro de copas y seguimiento personalizado de tu club.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${plusJakartaSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#0A0E13] text-[#F8FAFC] font-sans flex flex-col selection:bg-[#1FE07A]/30 selection:text-[#1FE07A]">
        {children}
      </body>
    </html>
  );
}
