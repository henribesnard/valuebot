import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { AuthProvider } from "@/lib/auth-context";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ValueBot \u2014 Pronostics IA",
  description:
    "Analyses sportives 100% IA : d\u00e9tection de value, bankroll publique et transparence totale. Football et tennis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <body className="font-body vb-root-bg bg-vb-bg text-vb-text min-h-screen antialiased tabular-nums">
        <AuthProvider>
          <Header />
          <main className="pb-[72px] mobile:pb-0">{children}</main>
          <Footer />
          <MobileTabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
