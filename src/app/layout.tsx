import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import Navbar from "../components/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
  title: "Blethershot",
  description: "Implemented a modern social application with a focus on user experience, built with React and Next.js, styled with Tailwind CSS, and incorporating secure authentication through Clerk and data management with Prisma.",
};

const open_sans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${open_sans.className}`}>
          <nav className="w-full bg-white/70 backdrop-blur-xl border-b border-[#e5e7eb] shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 fixed z-20">
            <Navbar />
          </nav>

          <main className="bg-gradient-to-br from-gray-100 to-gray-200 pt-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-58 min-h-screen">
            {children}
          </main>

          <footer className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
            <Footer />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
