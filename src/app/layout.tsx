import type { Metadata, Viewport } from "next";
import { Work_Sans, Roboto } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Triagem · Saúde Ocupacional",
  description: "Triagem de saúde ocupacional pré-embarque",
};

export const viewport: Viewport = {
  themeColor: "#193B4F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${workSans.variable} ${roboto.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
