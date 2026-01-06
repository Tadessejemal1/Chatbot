import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipper Chatbot",
  description: "MVP chat UI with sessions stored in Postgres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F3F3EE] text-zinc-900">
        {children}
      </body>
    </html>
  );
}
