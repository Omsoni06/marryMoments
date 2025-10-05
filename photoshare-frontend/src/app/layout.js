import { Inter, Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ClientBody from "@/components/layout/ClientBody";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Elegant serif for romantic headings
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
});

// Modern geometric for UI elements
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "PhotoShare Pro - Real-time Wedding Photo Sharing",
  description:
    "Instantly share wedding photos with guests through secure gallery links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientBody
        className={`${inter.variable} ${cormorant.variable} ${outfit.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ClientBody>
    </html>
  );
}
