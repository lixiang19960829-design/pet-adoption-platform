import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "萌宠之家 - 宠物领养平台",
  description: "萌宠之家是一个致力于连接待领养宠物与爱心领养者的平台。在这里，每一只宠物都能找到温暖的家。",
  keywords: ["宠物领养", "领养宠物", "猫咪领养", "狗狗领养", "宠物救助"],
  authors: [{ name: "萌宠之家" }],
  openGraph: {
    title: "萌宠之家 - 宠物领养平台",
    description: "让每一只宠物都能找到温暖的家",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
