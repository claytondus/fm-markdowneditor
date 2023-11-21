import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./ThemeProvider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${robotoMono.variable} ${robotoSlab.variable} bg-grey-100 dark:bg-grey-1000`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme={"system"}
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
