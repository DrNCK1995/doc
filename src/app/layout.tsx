import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_Telugu, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-telugu",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Dr Care for Kids | Healthy Kids. Happy Parents.",
    template: "%s | Dr Care for Kids",
  },
  description:
    "Your child's health companion — trusted pediatric care, Vaccine Buddy, Grow Right, Fever Guide, Dose Check, and parent-friendly tools by Dr. N. Chaitanya Krishna.",
  applicationName: "Dr Care for Kids",
  manifest: "/manifest.json",
  keywords: [
    "Dr Care for Kids",
    "pediatric tools",
    "vaccine buddy",
    "growth tracker",
    "Dr Chaitanya Krishna",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B4F6C" },
    { media: "(prefers-color-scheme: dark)", color: "#071820" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${cormorant.variable} ${notoTelugu.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
