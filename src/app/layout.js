import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./Components/navigation";
import SearchSidebar from "./Components/SearchSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CineApp - Votre Plateforme de Films",
  description: "Découvrez les meilleurs films et ajoutez-les à vos favoris",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <SearchSidebar />
        {children}
      </body>
    </html>
  );
}
