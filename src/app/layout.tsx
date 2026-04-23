import React, { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
    title: "ManageHub | Premium Shop Management",
    description: "Next-generation workspace for shop owners and managers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans`}>
                <AuthProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster richColors position="top-right" theme="dark" closeButton />
                    </TooltipProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
