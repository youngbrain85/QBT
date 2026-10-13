import type { Metadata } from "next";
import { Anton, IBM_Plex_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QBTTEXAS LLC — Physical AI. Digital 3D World.",
  description:
    "AI-based 3D modeling and digital twins for bridges, buildings and plants. Scan-to-BIM, segment review, measured IFC deliverables and an inspection platform, from QBTTEXAS LLC.",
  metadataBase: new URL("https://qbttexas.com"),
  openGraph: {
    title: "QBTTEXAS LLC — Physical AI. Digital 3D World.",
    description:
      "AI that turns field capture into measurable digital twins of bridges, buildings and plants.",
    images: ["/renders/wonsan-anmyeon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${montserrat.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
