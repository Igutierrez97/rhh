import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import SessionProviderWrapper from "@/components/SessionProviderWrapper/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salud Pública",
  description:
    "Sistema para el pago del máximo esfuerzo del Hospital Clínico Quirúrgico Hermanos Ameijeiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <SessionProviderWrapper>
        <body className={inter.className}>{children}</body>
      </SessionProviderWrapper>
    </html>
  );
}
