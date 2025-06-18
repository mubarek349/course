import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { UIProviders } from "@/components/heroUIProvider";

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
  title: "darulkubra",
  description: "darulkubra",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}  >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`fixed inset-0 ${geistSans.variable} ${geistMono.variable} antialiased bg-background  `}
        >
          <UIProviders>
            <ThemeProvider defaultTheme="dark" attribute="class">
              <div className="h-dvh overflow-hidden bg-gradient-to-br from-secondary-100 via-primary-100 to-secondary-100 grid text-primary-900 ">
                {children}
                <Toaster
                  toastOptions={{
                    classNames: {
                      loading:
                        "bg-info-100 border border-info-300 text-info-700",
                      success:
                        "bg-success-100 border border-success-300 text-success-700",
                      warning:
                        "bg-warning-100 border border-warning-300 text-warning-700",
                      error:
                        "bg-danger-100 border border-danger-300 text-danger-700",
                    },
                  }}
                />
              </div>
            </ThemeProvider>
          </UIProviders>
        </body>
      </html>
    </SessionProvider>
  );
}
