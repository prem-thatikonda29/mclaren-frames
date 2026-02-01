import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google"; // Car-geeky tech font
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "McLaren | Performance by Design",
  description: "Experience the legacy and future of McLaren Automotive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased bg-black text-white selection:bg-mclaren-orange selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
