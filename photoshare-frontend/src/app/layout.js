import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ClientBody from "@/components/layout/ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PhotoShare Pro - Real-time Wedding Photo Sharing",
  description:
    "Instantly share wedding photos with guests through secure gallery links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientBody className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ClientBody>
    </html>
  );
}
