import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChefHat } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapRecipe - AI Powered Recipe Suggestions",
  description: "Upload a photo of your ingredients and get recipe suggestions!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex items-center gap-3">
            <ChefHat className="h-8 w-8" />
            <h1 className="text-3xl font-semibold tracking-tight">
              SnapRecipe
            </h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-6">{children}</main>
        <footer className="bg-secondary text-secondary-foreground p-4 text-center text-sm">
          <div className="container mx-auto">
            © {new Date().getFullYear()} SnapRecipe. All rights reserved.
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
