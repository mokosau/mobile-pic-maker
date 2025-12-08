import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google'; // 日本語フォントに変更
import './globals.css';

// 日本語フォントを読み込み
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'スクショ作るくん',
  description: 'スマホフレームにスクリーンショットをはめ込み、テキストを配置して、魅力的なアプリストア画像を作成するツールです。',
  openGraph: {
    title: 'スクショ作るくん',
    description: 'スマホフレームにはめ込んだ、魅力的なアプリストア画像を作成するツール。',
    url: 'https://your-domain.com', // FIXME: あとで実際のドメインに置き換える
    siteName: 'スクショ作るくん',
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
    title: 'スクショ作るくん',
    description: 'スマホフレームにはめ込んだ、魅力的なアプリストア画像を作成するツール。',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJp.className}>{children}</body>
    </html>
  );
}
