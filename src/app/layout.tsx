import { Navbar } from "@/components/sections/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/context/WalletContextProvider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background`}
      >
        <QueryProvider>
          <WalletContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="max-w-7xl mx-auto border-x relative px-8 md:px-12">
                <div className="block w-px h-full border-l border-border absolute top-0 left-8 md:left-12 z-10"></div>
                <div className="block w-px h-full border-r border-border absolute top-0 right-8 md:right-12 z-10"></div>
                <Navbar />
                {children}
              </div>
              <Toaster richColors position="bottom-right" />
            </ThemeProvider>
          </WalletContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
