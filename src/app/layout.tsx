// src/app/layout.tsx
import Header from "@/components/Header/Header";
import "./globals.css"; // グローバルなCSSを読み込む
import Footer from "@/components/Footer/Footer";
import { M_PLUS_Rounded_1c } from "next/font/google";

export const metadata = {
  title: "My Pokedex",
  description: "Discover and explore Pokémon",
};

const fntMPLUSRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fntMPLUSRounded.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
