import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'モバイルアプリ スクリーンショット生成ツール',
  description: '魅力的なアプリストアのスクリーンショットを数秒で作成。',
  openGraph: {
    title: 'モバイルアプリ スクリーンショット生成ツール',
    description: '魅力的なアプリストアのスクリーンショットを数秒で作成。',
    url: 'https://your-domain.com',
    siteName: 'モバイルアプリ スクリーンショット生成ツール',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'モバイルアプリ スクリーンショット生成ツール',
    description: '魅力的なアプリストアのスクリーンショットを数秒で作成。',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
