import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mobile App Screenshot Generator',
  description: 'Create stunning app store screenshots in seconds. Upload your screenshots, add a title, and download a beautiful, store-ready image.',
  openGraph: {
    title: 'Mobile App Screenshot Generator',
    description: 'Create stunning app store screenshots in seconds.',
    url: 'https://your-domain.com', // Replace with your actual domain
    siteName: 'Mobile App Screenshot Generator',
    images: [
      {
        url: '/og-image.png', // Path to your OG image in the `public` folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Screenshot Generator',
    description: 'Create stunning app store screenshots in seconds.',
    images: ['/og-image.png'], // Path to your Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
