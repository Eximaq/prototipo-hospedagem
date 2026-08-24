import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/data/site-config";
import "./globals.css";

const googleAnalyticsId = "G-2Z3B47C8LR";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script
          id="google-analytics-loader"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        />
        <script
          id="google-analytics-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
