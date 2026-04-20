import type { Metadata } from 'next';
import { Cormorant_Garamond, Cinzel, Jost } from 'next/font/google';
import './globals.css';
import '@/styles/invitation.css';

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jost = Jost({
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LiveFrame | Wedding Livestream Invitations',
  description: 'Create beautiful, cinematic live-stream invitation pages.',
};

import CustomCursor from '@/components/invitation/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${jost.variable}`}>
      <body className="antialiased font-sans text-cream bg-maroon selection:bg-gold/30 selection:text-gold-light min-h-screen">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
