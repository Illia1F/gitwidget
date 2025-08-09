import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { BuilderProvider } from '@/contexts/builder-context';
import { SiteHeader } from '@/components/layouts/site-header';

import './globals.css';

export const metadata: Metadata = {
  title: 'GitWidget',
  description:
    'GitWidget lets you generate and download beautiful SVGs of your GitHub stats, contributions, and more. Customize themes, labels, borders, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <BuilderProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <main className="min-h-[calc(100vh-4rem)] w-full">{children}</main>
          </ThemeProvider>
        </BuilderProvider>
      </body>
    </html>
  );
}
