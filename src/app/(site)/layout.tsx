import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { BuilderProvider } from '@/contexts/builder-context';
import { SiteHeader } from '@/components/layouts/site-header';

import '../globals.css';

export const metadata: Metadata = {
  title: 'GitWidget',
  description:
    'GitWidget lets you generate and download beautiful SVGs of your GitHub stats, contributions, and more. Customize themes, labels, borders, and more.',
};

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BuilderProvider>
            <SiteHeader />
            <main className="flex w-full">{children}</main>
          </BuilderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
