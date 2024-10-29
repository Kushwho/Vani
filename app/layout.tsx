import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { AxiosContextProvider } from "@/context/AxiosContext";
import Wrapper from "./wrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vanii",
  description: "An AI-based language learning platform designed to be your personal assistant in mastering a new language. Preparing for competitive exams like TOEFL, IELTS etc.? Want to improve your professional soft skills? Or maybe you just want to communicate better? Look no further. Our innovative AI-powered tool ensures that you receive the best learning experience tailored to your individual needs.",
  icons:{
    icon:"images/icons/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Number of times rendering");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AxiosContextProvider>
          <AuthProvider>
            <Wrapper>
              <div className="mx-auto">
                {children}
                <Toaster />
              </div>
            </Wrapper>
          </AuthProvider>
        </AxiosContextProvider>
      </body>
    </html>
  );
}
