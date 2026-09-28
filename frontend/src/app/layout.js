"use client";

import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="id">
      <head>
        <title>PROXIMEDIA — Enterprise Software Solutions</title>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between selection:bg-[#2D9CFF] selection:text-white">
        {!isAdminRoute && <Navbar />}
        <div className="flex-grow">{children}</div>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
