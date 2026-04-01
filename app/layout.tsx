import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { ClientProviders } from "./client-providers";
import "./globals.css";

import 'react-international-phone/style.css'

import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - Plataforma de Rifas en República Dominicana`,
    template: `%s | ${BRAND.name}`,
  },
  description: "Participa en rifas de productos premium. Plataforma segura y transparente en República Dominicana.",
  authors: [{ name: BRAND.name }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || BRAND.url),
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
    <html lang="es">
      <body>
        <Providers>
          <ClientProviders />
          {children}
        </Providers>
      </body>
    </html>
  );
}
