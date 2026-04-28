import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';
import type { Metadata } from 'next';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = { 
  title: '삼양식품',
  description: '삼양식품 어드민',
  icons: {
    icon: '/assets/samyang-favicon.png',
  },
} satisfies Metadata;

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
