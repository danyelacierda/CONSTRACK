import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "CONSTRACK — Construction Fleet & Fuel Accountability",
  description: "Fleet, fuel, and equipment accountability system for Philippine construction companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#111418",
        },
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen bg-background text-foreground antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
