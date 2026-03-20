import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ToastProvider } from "\@/components/atoms/Toast";
import Navbar from "\@/components/organisms/Navbar";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mobil uygulamalarda zoom'u kapatmak yerel uygulama hissini artırır
};

export const metadata: Metadata = {
  title: "Synth Control X - AI Photo Studio",
  description: "Kendi Yüzünüzü kullanarak profesyonel yapay zeka fotoğrafları üretin.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SCX Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}



