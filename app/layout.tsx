import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { ClientProviders } from "./client-providers";
import "./globals.css";

import 'react-international-phone/style.css'
export const metadata: Metadata = {
  title: {
    default: "Rifas Mora Motors - Plataforma de Rifas en República Dominicana",
    template: "%s | Rifas Mora Motors",
  },
  description: "Participa en rifas de productos premium. Plataforma segura y transparente en República Dominicana.",
  authors: [{ name: "Rifas Mora Motors" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://rifasmoramotors.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientProviders />
          {children}
        </Providers>
      </body>
    </html>
  );
}

